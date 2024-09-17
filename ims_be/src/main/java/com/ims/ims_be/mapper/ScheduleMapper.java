package com.ims.ims_be.mapper;

import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.entity.job.Job;
import org.mapstruct.*;
import java.util.List;
import java.util.stream.Collectors;

import com.ims.ims_be.dto.schedule.*;
import com.ims.ims_be.entity.schedule.*;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {

    @Named("enumToString")
    default String enumToString(Enum<?> enumValue) {
        return enumValue != null ? enumValue.name() : null;
    }

    @Mapping(target = "jobTitle", expression = "java(getJobTitle(schedule.getJob()))")
    @Mapping(target = "candidateName", expression = "java(getCandidateName(schedule.getCandidate()))")
    @Mapping(target = "interviewers", expression = "java(getInterviewerDtos(schedule.getScheduleInterviewers()))")
    ScheduleInListDto scheduleToScheduleInListDTO(Schedule schedule);

    @Mapping(target = "jobTitle", expression = "java(getJobTitle(schedule.getJob()))")
    @Mapping(target = "candidateName", expression = "java(getCandidateName(schedule.getCandidate()))")
//    @Mapping(target = "recruiterName", expression = "java(getRecruiterName(schedule.getRecruiter()))")
    @Mapping(target = "interviewers", expression = "java(getInterviewerDtos(schedule.getScheduleInterviewers()))")
    @Mapping(target = "status", qualifiedByName = "enumToString")
    List<ScheduleInListDto> scheduleListToScheduleInListDTOList(List<Schedule> schedules);

    @Mapping(target = "jobTitle", source = "job.title")
    @Mapping(target = "candidateName", source = "candidate.fullName")
    @Mapping(target = "recruiterName", source = "candidate.recruiter.account.username")
    @Mapping(source = "status", target = "status", qualifiedByName = "enumToString")
    @Mapping(target = "interviewers", expression = "java(getInterviewerDtos(schedule.getScheduleInterviewers()))")
    ScheduleDetailDto scheduleToDetailDTO(Schedule schedule);

    @Mapping(target = "job", ignore = true)
    @Mapping(target = "candidate", ignore = true)
//    @Mapping(target = "recruiter", ignore = true)
    @Mapping(target = "scheduleInterviewers", ignore = true)
    Schedule detailDTOToSchedule(ScheduleDetailDto scheduleDetailDto);

    @Mapping(target = "job", ignore = true)
    @Mapping(target = "candidate", ignore = true)
//    @Mapping(target = "recruiter", ignore = true)
    @Mapping(target = "scheduleInterviewers", ignore = true)
    void updateScheduleFromDto(ScheduleDetailDto scheduleDetailDto, @MappingTarget Schedule schedule);


    default String getRecruiterName(User recruiter) {
        if (recruiter == null || recruiter.getAccount() == null) {
            return null;
        }
        return  recruiter.getAccount().getUsername();
    }

    default String getCandidateName(Candidate candidate) {
        if (candidate == null) {
            return null;
        }
        return  candidate.getFullName();
    }

    default String getJobTitle(Job job) {
        if (job == null) {
            return null;
        }
        return  job.getTitle();
    }

    default Page<ScheduleInListDto> schedulesToListDTO(Page<Schedule> schedules) {
        return schedules.map(this::scheduleToScheduleInListDTO);
    }
    default List<InterviewerDto> getInterviewerDtos(List<ScheduleInterviewer> scheduleInterviewers) {
        if (scheduleInterviewers == null) {
            return null;
        }
        return scheduleInterviewers.stream()
                .map(si -> {
                    User interviewer = si.getInterviewer();
                    InterviewerDto dto = new InterviewerDto();
                    dto.setId(interviewer.getId());
                    dto.setFullName(interviewer.getFullName());
                    dto.setUserName(interviewer.getAccount().getUsername());
                    dto.setEmail(interviewer.getEmail());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}