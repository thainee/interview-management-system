package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Skill;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "job_benefit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobBenefit {

    @EmbeddedId
    private JobBenefitId id;

    @ManyToOne
    @MapsId("jobId")
    @JoinColumn(name = "job_id", referencedColumnName = "id")
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(name = "benefit", insertable = false, updatable = false)
    private Benefit benefit;

    public JobBenefit(JobBenefitId id){
        this.id = id;
    }
}