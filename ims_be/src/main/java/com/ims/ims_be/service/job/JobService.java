package com.ims.ims_be.service.job;

import com.ims.ims_be.dto.job.JobDetailDto;
import com.ims.ims_be.dto.job.JobInListDto;
import com.ims.ims_be.dto.job.JobRequestDto;
import com.ims.ims_be.entity.job.Job;
import org.springframework.data.domain.Page;

public interface JobService {
    Page<JobInListDto> searchJobs(String searchTerm, String status,  int page, int size);
    JobDetailDto getJobById(Integer id);
    JobDetailDto createJob(Job job);
    void deleteJob(int id);
    void scheduleStatusUpdate(Job job);
    JobDetailDto editJob(Integer id, JobRequestDto updatedJob);

}
