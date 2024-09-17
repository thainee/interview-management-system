package com.ims.ims_be.entity.schedule;

import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.entity.job.Job;
import com.ims.ims_be.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Builder.Default
    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<ScheduleInterviewer> scheduleInterviewers = new ArrayList<>();

    @Column(name = "interview_date", nullable = false)
    private Date interviewDate;

    @Column(name = "start_time", nullable = false)
    private Timestamp startTime;

    @Column(name = "end_time", nullable = false)
    private Timestamp endTime;

    @Column(name="result", nullable = false)
    private String result;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ScheduleStatus status;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "note")
    private String note;

    @Column(name = "meeting_link")
    private String meetingLink;

//    public void addInterviewer(User interviewer) {
//        ScheduleInterviewer scheduleInterviewer = new ScheduleInterviewer(this, interviewer);
//        scheduleInterviewers.add(scheduleInterviewer);
//    }
//
//    public void removeInterviewer(User interviewer) {
//        scheduleInterviewers.removeIf(si -> si.getInterviewer().equals(interviewer));
//    }
}