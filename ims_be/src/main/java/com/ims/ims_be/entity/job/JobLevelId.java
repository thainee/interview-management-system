package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Level;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobLevelId implements Serializable {

    @Column(name = "job_id", nullable = false)
    private Integer jobId;

    @Column(name = "level", nullable = false)
    @Enumerated(EnumType.STRING)
    private Level level;

    public JobLevelId(Integer id) {
        this.jobId = id;
    }
}