package com.ims.ims_be.entity.candidate;

import com.ims.ims_be.enums.Skill;
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
@EqualsAndHashCode
public class CandidateSkillId implements Serializable {
    private Integer candidateId;

    @Enumerated(EnumType.STRING)
    private Skill skill;
}