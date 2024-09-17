// JobSkillId.java
package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSkillId implements Serializable {

    @Column(name = "job_id", nullable = false)
    private Integer jobId;

    @Column(name = "skill", nullable = false)
    @Enumerated(EnumType.STRING)
    private Skill skill;

    public JobSkillId(Skill skill) {
        this.skill = skill;
    }
}
