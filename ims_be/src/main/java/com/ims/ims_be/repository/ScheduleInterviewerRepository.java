package com.ims.ims_be.repository;

import com.ims.ims_be.entity.schedule.ScheduleInterviewer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleInterviewerRepository extends JpaRepository<ScheduleInterviewer, Integer> {
    void deleteByScheduleIdAndInterviewerId(Integer scheduleId, Integer interviewerId);
    void deleteByScheduleId(Integer scheduleId);
}