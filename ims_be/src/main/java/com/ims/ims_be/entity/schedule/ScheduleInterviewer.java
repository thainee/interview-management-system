package com.ims.ims_be.entity.schedule;

import com.ims.ims_be.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "schedule_interviewer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleInterviewer {
    @EmbeddedId
    private ScheduleInterviewerId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("scheduleId")
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User interviewer;

    public ScheduleInterviewer(Schedule schedule, User interviewer) {
        this.schedule = schedule;
        this.interviewer = interviewer;
        this.id = ScheduleInterviewerId.builder()
                .scheduleId(schedule.getId())
                .userId(interviewer.getId())
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ScheduleInterviewer)) return false;
        ScheduleInterviewer that = (ScheduleInterviewer) o;
        return Objects.equals(getSchedule(), that.getSchedule()) &&
                Objects.equals(getInterviewer(), that.getInterviewer());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getSchedule(), getInterviewer());
    }

}
