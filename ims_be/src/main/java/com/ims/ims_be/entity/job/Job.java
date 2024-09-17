package com.ims.ims_be.entity.job;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ims.ims_be.config.CustomSqlDateDeserializer;
import com.ims.ims_be.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="title", nullable=false)
    private String title;

    @Column(name="address")
    private String address;

    @Column(name="created_at")
    private Timestamp createdAt;

    @Column(name="description")
    private String description;

    //    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    @Column(name="end_date")
    private Date endDate;

    @Column(name="salary_from")
    private double salaryFrom;

    @Column(name="salary_to")
    private double salaryTo;

    //    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    @Column(name="start_date")
    private Date startDate;

    @Column(name="status", nullable = false)
    private String status;

    @Column(name="updated_at")
    private Timestamp updatedAt;

    @Column(name="updated_by")
    private Integer updatedBy;

    @ManyToOne
    @JoinColumn(name = "updated_by", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<JobSkill> jobSkills;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<JobLevel> jobLevels;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true )
    private List<JobBenefit> jobBenefits;
}