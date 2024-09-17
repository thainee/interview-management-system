package com.ims.ims_be.service.schedule;

import com.ims.ims_be.dto.candidate.CandidateDetailDto;
import com.ims.ims_be.dto.candidate.CandidateRequestDto;
import com.ims.ims_be.dto.schedule.*;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.entity.schedule.Schedule;
import com.ims.ims_be.entity.schedule.ScheduleInterviewer;
import com.ims.ims_be.enums.CandidateStatus;
import com.ims.ims_be.enums.Role;
import com.ims.ims_be.enums.ScheduleStatus;
import com.ims.ims_be.mapper.CandidateMapper;
import com.ims.ims_be.mapper.ScheduleMapper;
import com.ims.ims_be.mapper.UserMapper;
import com.ims.ims_be.repository.*;
import com.ims.ims_be.service.candidate.CandidateServiceImpl;
import com.ims.ims_be.service.mail.EmailSenderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@EnableScheduling
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final UserRepository userRepository;
    private final ScheduleInterviewerRepository scheduleInterviewerRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final UserMapper userMapper;
    private final EmailSenderService emailSenderService;
    private final CandidateServiceImpl candidateService;

    public ScheduleServiceImpl(ScheduleRepository scheduleRepository,
                               ScheduleMapper scheduleMapper,
                               UserRepository userRepository,
                               ScheduleInterviewerRepository scheduleInterviewerRepository,
                               JobRepository jobRepository,
                               CandidateRepository candidateRepository,
                               UserMapper userMapper,
                               EmailSenderService emailSenderService, CandidateServiceImpl candidateService) {
        this.scheduleRepository = scheduleRepository;
        this.scheduleMapper = scheduleMapper;
        this.userRepository = userRepository;
        this.scheduleInterviewerRepository = scheduleInterviewerRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.userMapper = userMapper;
        this.emailSenderService = emailSenderService;
        this.candidateService = candidateService;
    }

    @Override
    public Page<ScheduleInListDto> getSchedules(String searchTerm,
                                                Integer interviewer,
                                                String status,
                                                int pageNumber,
                                                int size) {
        int validPageNumber = Math.max(pageNumber, 0);
        int validPageSize = 10;

        Pageable pageable = PageRequest.of(validPageNumber, validPageSize);

        Page<Schedule> schedules = scheduleRepository.findSchedules(
                searchTerm != null && !searchTerm.isBlank() ? searchTerm : null,
                interviewer,
                status != null && !status.isBlank() ? String.valueOf(status) : null,
                pageable
        );

        // return scheduleMapper.schedulesToListDTO(scheduleRepository.findAll(pageable));
        return scheduleMapper.schedulesToListDTO(schedules);
    }

    @Override
    public List<InterviewerDto> searchInterviewers() {
        List<User> interviewers;
        interviewers = userRepository.findByRole(Role.INTERVIEWER);

        return userMapper.usersToInterviewerDtos(interviewers);
    }

    @Override
    public ScheduleDetailDto getScheduleById(Integer id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return scheduleMapper.scheduleToDetailDTO(schedule);
    }

    @Override
    public ScheduleDetailDto createSchedule(ScheduleDetailDto scheduleDTO) {
        // Get scheduledto first form fe
        // Convert to entity -> save to schedule
        // Save to schedule_interviewer

        // Compile the regex pattern and match against the candidateName
        Pattern pattern = Pattern.compile("(.*?)\\s*\\((\\d+)\\)");
        Matcher matcher = pattern.matcher(scheduleDTO.getCandidateName());

        // Ensure the matcher finds a match before accessing groups
        if (!matcher.find()) {
            throw new RuntimeException("Candidate name format is invalid");
        }

        Schedule schedule = scheduleMapper.detailDTOToSchedule(scheduleDTO);

        // Set job, candidate, and recruiter
        schedule.setJob(jobRepository.findByTitle(scheduleDTO.getJobTitle())
                .orElseThrow(() -> new RuntimeException("Job not found")));
        schedule.setCandidate(candidateRepository.findById(Integer.parseInt(matcher.group(2)))
                .orElseThrow(() -> new RuntimeException("Candidate not found")));
//        schedule.setRecruiter(userRepository.findByAccount_Username(scheduleDTO.getRecruiterName())
//                .orElseThrow(() -> new RuntimeException("Recruiter not found")));

        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Handle interviewers
        List<ScheduleInterviewer> scheduleInterviewers = scheduleDTO.getInterviewers().stream()
                .map(interviewerDto -> {
                    User interviewer = userRepository.findByAccount_Username(interviewerDto.getUserName())
                            .orElseThrow(() -> new RuntimeException("Interviewer not found"));
                    return new ScheduleInterviewer(savedSchedule, interviewer);
                })
                .collect(Collectors.toList());
        scheduleInterviewerRepository.saveAll(scheduleInterviewers);

        //update candidate status
        candidateService.updateCandidateStatus(Integer.parseInt(matcher.group(2)), CandidateStatus.WAITING_FOR_INTERVIEW);
        return scheduleMapper.scheduleToDetailDTO(schedule);
    }


    @Override
    public ScheduleDetailDto updateSchedule(Integer id, ScheduleDetailDto scheduleDTO) {
        Schedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        Integer candidateId = existingSchedule.getCandidate().getId();
        Candidate candidate = existingSchedule.getCandidate();

        scheduleMapper.updateScheduleFromDto(scheduleDTO, existingSchedule);

        if (scheduleDTO.getResult().equals("Passed")){
            candidateService.updateCandidateStatus(candidateId, CandidateStatus.PASSED_INTERVIEW);
        } else if (scheduleDTO.getResult().equals("Failed")){
            candidateService.updateCandidateStatus(candidateId, CandidateStatus.FAILED_INTERVIEW);
        }        // Update job, candidate, and recruiter if they've changed
        if (!existingSchedule.getJob().getTitle().equals(scheduleDTO.getJobTitle())) {
            existingSchedule.setJob(jobRepository.findByTitle(scheduleDTO.getJobTitle())
                    .orElseThrow(() -> new RuntimeException("Job not found")));
        }
        if (!existingSchedule.getCandidate().getFullName().equals(scheduleDTO.getCandidateName())) {
            existingSchedule.setCandidate(candidateRepository.findByFullName(scheduleDTO.getCandidateName())
                    .orElseThrow(() -> new RuntimeException("Candidate not found")));
        }
//        if (!existingSchedule.getRecruiter().getAccount().getUsername().equals(scheduleDTO.getRecruiterName())) {
//            existingSchedule.setRecruiter(userRepository.findByAccount_Username(scheduleDTO.getRecruiterName())
//                    .orElseThrow(() -> new RuntimeException("Recruiter not found")));
//        }
        if (!candidate.getRecruiter().getAccount().getUsername().equals(scheduleDTO.getRecruiterName())) {
            candidate.setRecruiter(userRepository.findByAccount_Username(scheduleDTO.getRecruiterName())
                    .orElseThrow(() -> new RuntimeException("Recruiter not found")));
        }
        Candidate updatedCandidate = candidateRepository.save(candidate);
        // Update interviewers
        existingSchedule.getScheduleInterviewers().clear();
        List<ScheduleInterviewer> updatedInterviewers = scheduleDTO.getInterviewers().stream()
                .map(interviewerDto -> {
                    User interviewer = userRepository.findByAccount_Username(interviewerDto.getUserName())
                            .orElseThrow(() -> new RuntimeException("Interviewer not found"));
//                    ScheduleInterviewer scheduleInterviewer = new ScheduleInterviewer();
//                    scheduleInterviewer.setSchedule(existingSchedule);
//                    scheduleInterviewer.setInterviewer(interviewer);
                    return new ScheduleInterviewer(existingSchedule, interviewer);
                })
                .collect(Collectors.toList());
        existingSchedule.getScheduleInterviewers().addAll(updatedInterviewers);

        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
        return scheduleMapper.scheduleToDetailDTO(updatedSchedule);
    }


    @Override
    @Transactional
    public ScheduleInterviewerDto addInterviewerToSchedule(ScheduleInterviewerDto dto) {
        Schedule schedule = scheduleRepository.findById(dto.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        User interviewer = userRepository.findById(dto.getInterviewerId())
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        ScheduleInterviewer scheduleInterviewer = new ScheduleInterviewer();
        scheduleInterviewer.setSchedule(schedule);
        scheduleInterviewer.setInterviewer(interviewer);

        scheduleInterviewerRepository.save(scheduleInterviewer);
        return dto;
    }

    @Override
    @Transactional
    public void removeInterviewerFromSchedule(Integer scheduleId, Integer interviewerId) {
        scheduleInterviewerRepository.deleteByScheduleIdAndInterviewerId(scheduleId, interviewerId);
    }

    @Override
    public InterviewerDto getInterviewerByEmail(String email) {
        User interviewer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        return userMapper.userToInterviewerDto(interviewer);
    }

    @Override
    public ResponseEntity<?> sendReminderEmail(ReminderRequest ReminderRequest) {
        try {
            List<String> emails = ReminderRequest.getEmails();
            Integer id = ReminderRequest.getId();

            Schedule existingSchedule = scheduleRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Schedule not found"));

            Integer candidateId = existingSchedule.getCandidate().getId();
            CandidateDetailDto candidate = candidateService.getCandidateById(candidateId);

            ScheduleDetailDto schedule = getScheduleById(id);
            if (schedule == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Schedule not found with id: " + id);
            }
            List<String> sentEmails = new ArrayList<>();
            List<String> failedEmails = new ArrayList<>();

            String baseUrl = "http://localhost:3000/home";


            SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy");
            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("hh:mm a");

            LocalDateTime startDateTime = schedule.getStartTime().toLocalDateTime();
            LocalDateTime endDateTime = schedule.getEndTime().toLocalDateTime();

            String formattedDate = dateFormatter.format(schedule.getInterviewDate());
            String formattedStartTime = startDateTime.format(outputFormatter);
            String formattedEndTime = endDateTime.format(outputFormatter);

            for (String email : emails) {
                InterviewerDto interviewer = getInterviewerByEmail(email);
                if (interviewer != null) {
                    String emailContent = "Dear " + interviewer.getUserName() + ",\n\n"
                            + "This email is from IMS system,\n"
                            + "You have an interview schedule on " + formattedDate + " at " + formattedStartTime + " to " + formattedEndTime + "\n"
                            + "With Candidate " + candidate.getFullName() + " position " + candidate.getPosition() + ".\n"
                            + "If anything wrong, please refer recruiter " + schedule.getRecruiterName() + " or visit our website: " + baseUrl + "\n"
                            + "Please join interview room ID: " + (schedule.getMeetingLink().isEmpty() ? schedule.getMeetingLink() : "N/A") + "\n\n"
                            + "Thanks & Regards!\n"
                            + "IMS Team";

                    emailSenderService.sendEmail(interviewer.getEmail(),
                            "no-reply-email-IMS-system " + schedule.getTitle(),
                            emailContent);

                    sentEmails.add(email);
                } else {
                    failedEmails.add(email);
                }
            }
            if (!sentEmails.isEmpty()) {
                schedule.setStatus("INVITED");
                updateSchedule(id, schedule);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("sentEmails", sentEmails);
            response.put("failedEmails", failedEmails);

            return ResponseEntity.ok(response);
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending reminders: " + e.getMessage());
        }


    }

//    @Override
//    public void sendReminderEmail(ReminderRequest reminderRequest) {
//        try {
//            List<String> emails = reminderRequest.getEmails();
//            Integer id = reminderRequest.getId();
//
//            ScheduleDetailDto schedule = getScheduleById(id);
//            if (schedule == null) {
//                throw new RuntimeException("Schedule not found with id: " + id);
//            }
//
//            String baseUrl = "http://localhost:3000/schedules/";
//
//            for (String email : emails) {
//                InterviewerDto interviewer = getInterviewerByEmail(email);
//                if (interviewer != null) {
//                    String fullLink = baseUrl + id;
//                    String emailContent = "Dear " + interviewer.getUserName() + ",\n\n"
//                            + "This is a reminder for your upcoming interview. "
//                            + "Please click on the following link to view the details:\n"
//                            + fullLink;
//                    emailSenderService.sendEmail(interviewer.getEmail(),
//                            "Reminder: Upcoming Interview",
//                            emailContent);
//                }
//            }
//
//            schedule.setStatus("INVITED");
//            updateSchedule(id, schedule);
//        } catch(Exception e){
//            // Log the error instead of returning a ResponseEntity
//            e.printStackTrace();
//        }
//    }
//
//    public List<ScheduleDetailDto> getSchedulesForReminder() {
//        // Lấy danh sách các cuộc phỏng vấn trong 24 giờ tới và chưa gửi nhắc nhở
////        LocalDateTime now = LocalDateTime.now();
////        LocalDateTime tomorrow = now.plusDays(1);
//        List<Schedule> schedules = scheduleRepository.findByStatus(ScheduleStatus.INVITED);
//        return schedules.stream()
//                .map(scheduleMapper::scheduleToDetailDTO)
//                .collect(Collectors.toList());
//    }
//    @Scheduled(cron = "0 12 11 * * ?")
//    public void sendDailyReminders() {
//        List<ScheduleDetailDto> schedulesToRemind = getSchedulesForReminder();
//
//        for (ScheduleDetailDto schedule : schedulesToRemind) {
//            List<String> emails = schedule.getInterviewers().stream()
//                    .map(InterviewerDto::getEmail)
//                    .collect(Collectors.toList());
//
//            ReminderRequest reminderRequest = new ReminderRequest();
//            reminderRequest.setEmails(emails);
//            reminderRequest.setId(schedule.getId());
//
//            sendReminderEmail(reminderRequest);
//        }
//    }
}
