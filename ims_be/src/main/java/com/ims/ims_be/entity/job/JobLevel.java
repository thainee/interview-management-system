// JobLevel.java
package com.ims.ims_be.entity.job;

import com.ims.ims_be.enums.Level;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "job_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobLevel {

    @EmbeddedId
    private JobLevelId id;

    @ManyToOne
    @MapsId("jobId")
    @JoinColumn(name = "job_id", referencedColumnName = "id")
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", insertable = false, updatable = false)
    private Level level;

    public JobLevel(JobLevelId id){
        this.id = id;
    }
}