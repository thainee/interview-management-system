package com.ims.ims_be.service.schedule;

import com.ims.ims_be.dto.schedule.*;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ScheduleService {
    Page<ScheduleInListDto> getSchedules(String searchTerm, Integer interviewer, String status, int page, int size);
    List<InterviewerDto> searchInterviewers();
    ScheduleDetailDto getScheduleById(Integer id);
    ScheduleDetailDto createSchedule(ScheduleDetailDto scheduleDTO);
    ScheduleDetailDto updateSchedule(Integer id, ScheduleDetailDto scheduleDTO);
    ScheduleInterviewerDto addInterviewerToSchedule(ScheduleInterviewerDto dto);
    void removeInterviewerFromSchedule(Integer scheduleId, Integer interviewerId);
    InterviewerDto getInterviewerByEmail(String email);
    ResponseEntity<?> sendReminderEmail(ReminderRequest ReminderRequest);
    //  void sendReminderEmail(ReminderRequest ReminderRequest);
}