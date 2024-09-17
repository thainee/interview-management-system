package com.ims.ims_be.dto.job;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ims.ims_be.config.CustomSqlDateDeserializer;
import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Level;
import com.ims.ims_be.enums.Skill;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDetailDto {

    private Integer id;
    private String title;
    private String address;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Timestamp createdAt;
    private String description;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date endDate;
    private double salaryFrom;
    private double salaryTo;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date startDate;
    private String status;
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private Timestamp updatedAt;
    private String updatedBy;
    private String updatedByName;
    private List<Benefit> benefits;
    private List<Level> levels;
    private List<Skill> skills;
}

