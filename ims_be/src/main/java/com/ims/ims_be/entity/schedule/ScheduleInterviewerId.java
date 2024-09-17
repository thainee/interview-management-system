package com.ims.ims_be.entity.schedule;


import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleInterviewerId implements Serializable {
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @Column(name = "user_id")
    private Integer userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ScheduleInterviewerId)) return false;
        ScheduleInterviewerId that = (ScheduleInterviewerId) o;
        return Objects.equals(getScheduleId(), that.getScheduleId()) && Objects.equals(getUserId(), that.getUserId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getScheduleId(), getUserId());
    }
}