package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "job_skill")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkill {

    @EmbeddedId
    private JobSkillId id;

    @ManyToOne
    @MapsId("jobId")
    @JoinColumn(name = "job_id", referencedColumnName = "id")
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill", insertable = false, updatable = false)
    private Skill skill;

    public JobSkill(JobSkillId id) {
        this.id = id;
    }
}
