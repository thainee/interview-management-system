package com.ims.ims_be.entity.candidate;
import com.ims.ims_be.enums.Skill;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_skill")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CandidateSkill {
    @EmbeddedId
    private CandidateSkillId id;

    @ManyToOne(cascade = {
            CascadeType.PERSIST,
            CascadeType.DETACH,
            CascadeType.MERGE,
            CascadeType.REFRESH
    }, fetch = FetchType.LAZY)
    @MapsId("candidateId")
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill", insertable = false, updatable = false)
    private Skill skill;
}
