package com.ims.ims_be.service.job;

import com.ims.ims_be.dto.job.JobDetailDto;
import com.ims.ims_be.dto.job.JobInListDto;
import com.ims.ims_be.dto.job.JobRequestDto;
import com.ims.ims_be.entity.job.*;
import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Level;
import com.ims.ims_be.enums.Skill;
import com.ims.ims_be.mapper.JobMapper;
import com.ims.ims_be.repository.JobRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;



    @Override
    public Page<JobInListDto> searchJobs(String searchTerm, String status, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        if (searchTerm != null && !searchTerm.isBlank() && status != null && !status.isBlank()) {
            return jobRepository.findByTitleContainingAndStatus(searchTerm, status, pageable)
                    .map(jobMapper::jobToJobInListDto);
        } else if (searchTerm != null && !searchTerm.isBlank()) {
            return jobRepository.findByTitleContaining(searchTerm, pageable)
                    .map(jobMapper::jobToJobInListDto);
        } else if (status != null && !status.isBlank()) {
            return jobRepository.findByStatus(status, pageable)
                    .map(jobMapper::jobToJobInListDto);
        } else {
            return jobRepository.findAllSortedByStatusAndCreatedDate(pageable)
                    .map(jobMapper::jobToJobInListDto);
        }
    }

    @Override
    public JobDetailDto getJobById(Integer id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        return jobMapper.jobToJobDetailDto(job);
    }

    @Override
    public JobDetailDto createJob(Job job) {
        if(job.getStatus() == null || job.getStatus().isBlank()) {
            job.setStatus("Draft");
        }
        LocalDate currentDate = LocalDate.now();
        if (job.getTitle() == null || job.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Job Title is required.");
        }
        // etc
        if (jobRepository.existsByTitleIgnoreCase(job.getTitle())) {
            throw new IllegalArgumentException("A Job with this title is already existed");
        }
        if (job.getJobSkills() == null || job.getJobSkills().isEmpty()) {
            throw new IllegalArgumentException("Skills are required.");
        }
        if (Double.isNaN(job.getSalaryTo())) {
            throw new IllegalArgumentException("Salary To is required.");
        }
        if (job.getSalaryFrom() > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Salary From must be  less than " + Integer.MAX_VALUE);
        }

        if (job.getSalaryTo() <= 0 || job.getSalaryTo() > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Salary To must be greater than 0 and less than " + Integer.MAX_VALUE);
        }


        if (job.getSalaryTo() <= job.getSalaryFrom()) {
            throw new IllegalArgumentException("Salary To must be greater than Salary From.");
        }
        if (job.getJobBenefits() == null || job.getJobBenefits().isEmpty()) {
            throw new IllegalArgumentException("Benefits are required.");
        }
        if (job.getJobLevels() == null || job.getJobLevels().isEmpty()) {
            throw new IllegalArgumentException("Levels are required.");
        }

        // Kiểm tra và giới hạn độ dài của description
        if (job.getDescription() != null && job.getDescription().length() > 500) {
            throw new IllegalArgumentException("Description exceeds the limit of 500 characters.");
        }

        if (Double.isNaN(job.getSalaryFrom())){
            job.setSalaryFrom(0.0);
        }

        if (job.getStartDate().toLocalDate().isBefore(currentDate)) {
            throw new IllegalArgumentException("Start date must be later than current date");
        }
        if (job.getEndDate() != null && job.getEndDate().toLocalDate().isBefore(job.getStartDate().toLocalDate())) {
            throw new IllegalArgumentException("End date must be later than start date");
        }
        if (job.getJobSkills() != null) {
            job.getJobSkills().forEach(skill -> skill.setJob(job));
        }
        if (job.getJobBenefits() != null) {
            job.getJobBenefits().forEach(benefit -> benefit.setJob(job));
        }
        if (job.getJobLevels() != null) {
            job.getJobLevels().forEach(level -> level.setJob(job));
        }
        Job savedJob = jobRepository.save(job);

        scheduleStatusUpdate(savedJob);
        job.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        job.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return jobMapper.jobToJobDetailDto(savedJob);
    }

    @Override
    public void deleteJob(int id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job with id : " + id + " not found"));
        jobRepository.deleteById(id);
    }

    @Override
    public void scheduleStatusUpdate(Job job) {
        LocalDate currentDate = LocalDate.now();

        if(job.getStartDate() != null && job.getStartDate().toLocalDate().isEqual(currentDate)){
            job.setStatus("Open");
        } else if (job.getEndDate() != null && job.getEndDate().toLocalDate().isEqual(currentDate)) {
            job.setStatus("Closed");
        } else if (job.getStartDate()!=null && job.getStartDate().toLocalDate().isBefore(currentDate)) {
            job.setStatus("Open");
        } else if (job.getEndDate() !=null && job.getEndDate().toLocalDate().isBefore(job.getStartDate().toLocalDate())) {
            throw new IllegalArgumentException("End date must be later than current date");
        } else {
            job.setStatus("Draft");
        }
        jobRepository.save(job);
    }

    @Override
    public JobDetailDto editJob(Integer id, JobRequestDto updatedJob) {
        Job nowJob = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        LocalDate current = LocalDate.now();

        if (updatedJob.getTitle() == null) {
            throw new IllegalArgumentException("Title is required");
        }

        if (!nowJob.getTitle().equalsIgnoreCase(updatedJob.getTitle()) && jobRepository.existsByTitleIgnoreCase(updatedJob.getTitle())) {
            throw new IllegalArgumentException("A job with this title is already existed");
        }
        if (updatedJob.getStartDate().toLocalDate().isBefore(current)){
            throw new IllegalArgumentException("Start date must be later than current date");
        }
        if (updatedJob.getEndDate() != null && updatedJob.getEndDate().toLocalDate()
                .isBefore(updatedJob.getStartDate().toLocalDate())) {
            throw new IllegalArgumentException("End date must be later than start date");
        }
        if (updatedJob.getDescription() != null && updatedJob.getDescription().length()>500) {
            throw new IllegalArgumentException("Description exceeds the limit of 500 characters");
        }


        if (updatedJob.getBenefits() == null || updatedJob.getBenefits().isEmpty()) {
            throw new IllegalArgumentException("Benefits are required");
        }
        if (updatedJob.getSkills() == null || updatedJob.getSkills().isEmpty()) {
            throw new IllegalArgumentException("Skills are required");
        }
        if (updatedJob.getLevels() == null || updatedJob.getLevels().isEmpty()) {
            throw new IllegalArgumentException("Levels are required");
        }
        if (updatedJob.getSalaryFrom() == null) {
            throw new IllegalArgumentException("Salary From is required.");
        }

        if (updatedJob.getSalaryFrom() > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Salary From must be greater than 0 and less than " + Integer.MAX_VALUE);
        }

        if (Double.isNaN(updatedJob.getSalaryTo())) {
            throw new IllegalArgumentException("Salary To is required.");
        }

        if (updatedJob.getSalaryTo() <= 0 || updatedJob.getSalaryTo() > Integer.MAX_VALUE) {
            throw new IllegalArgumentException("Salary To must be greater than 0 and less than " + Integer.MAX_VALUE);
        }

        if (updatedJob.getSalaryTo() <= updatedJob.getSalaryFrom()) {
            throw new IllegalArgumentException("Salary To must be greater than Salary From.");
        }

        nowJob.setTitle(updatedJob.getTitle());
        nowJob.setStartDate(updatedJob.getStartDate());
        nowJob.setEndDate(updatedJob.getEndDate());
        nowJob.setSalaryFrom(updatedJob.getSalaryFrom());
        nowJob.setSalaryTo(updatedJob.getSalaryTo());
        nowJob.setAddress(updatedJob.getAddress());
        nowJob.setDescription(updatedJob.getDescription());
        nowJob.setUpdatedBy(updatedJob.getUpdatedBy());
        nowJob.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        // Update benefits
        nowJob.getJobBenefits().clear();
        updatedJob.getBenefits().forEach(benefitString -> {
            Benefit benefit = Benefit.valueOf(benefitString.toUpperCase());
            JobBenefit jobBenefit = new JobBenefit(new JobBenefitId(nowJob.getId(), benefit));

            jobBenefit.setJob(nowJob);
            nowJob.getJobBenefits().add(jobBenefit);
        });

        // Update skills
        nowJob.getJobSkills().clear();
        updatedJob.getSkills().forEach(skillString -> {
            Skill skill = Skill.valueOf(skillString.toUpperCase());
            JobSkill jobSkill = new JobSkill(new JobSkillId(nowJob.getId(), skill));
            jobSkill.setJob(nowJob);
            nowJob.getJobSkills().add(jobSkill);
        });

        // Update levels
        nowJob.getJobLevels().clear();
        updatedJob.getLevels().forEach(levelString -> {
            Level level = Level.valueOf(levelString.toUpperCase());
            JobLevel jobLevel = new JobLevel(new JobLevelId(nowJob.getId(), level));
            jobLevel.setJob(nowJob);
            nowJob.getJobLevels().add(jobLevel);
        });

        scheduleStatusUpdate(nowJob);

        Job savedJob = jobRepository.save(nowJob);
        return jobMapper.jobToJobDetailDto(savedJob);
    }
    @Scheduled(cron = " 0 0 0 * * *")
    public void updateJobStatusesDaily() {
        LocalDate currentDate = LocalDate.now();
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            if (job.getStartDate() != null && job.getStartDate().toLocalDate().isEqual(currentDate)) {
                job.setStatus("Open");
            } else if (job.getEndDate() != null && job.getEndDate().toLocalDate().isEqual(currentDate)) {
                job.setStatus("Closed");
            } else if (job.getStartDate() != null && job.getStartDate().toLocalDate().isBefore(currentDate) && (job.getEndDate() == null || job.getEndDate().toLocalDate().isAfter(currentDate))) {
                job.setStatus("Open");
            } else if (job.getEndDate() != null && job.getEndDate().toLocalDate().isBefore(currentDate)) {
                job.setStatus("Closed");
            }
            jobRepository.save(job);
        }
    }
}

