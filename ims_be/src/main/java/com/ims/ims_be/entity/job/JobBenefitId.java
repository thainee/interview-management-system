package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Skill;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobBenefitId implements Serializable { // Changed to public

    @Column(name = "job_id", nullable = false)
    private Integer jobId;

    @Column(name = "benefit", nullable = false)
    @Enumerated(EnumType.STRING)
    private Benefit benefit;

    public JobBenefitId(Integer jobId){
        this.jobId = jobId;
    }
}
