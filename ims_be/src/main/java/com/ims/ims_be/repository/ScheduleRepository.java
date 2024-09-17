package com.ims.ims_be.repository;

import com.ims.ims_be.entity.schedule.Schedule;
import com.ims.ims_be.enums.ScheduleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query("SELECT DISTINCT s FROM Schedule s " +
            "LEFT JOIN s.scheduleInterviewers si " +
            "LEFT JOIN si.interviewer i " +
            "WHERE (:searchTerm IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:interviewer IS NULL OR i.id = :interviewer) " +
            "AND (:status IS NULL OR LOWER(s.status) LIKE LOWER(CONCAT('%', :status, '%')))")
    Page<Schedule> findSchedules(@Param("searchTerm") String searchTerm,
                                 @Param("interviewer") Integer interviewer,
                                 @Param("status") String status,
                                 Pageable pageable);


    @Query("SELECT s FROM Schedule s  WHERE LOWER(s.status) LIKE LOWER(CONCAT('%', :status, '%'))")
    List<Schedule> findByStatus(@Param("status") ScheduleStatus status);
}