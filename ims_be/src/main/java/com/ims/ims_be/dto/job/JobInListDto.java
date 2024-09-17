package com.ims.ims_be.dto.job;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ims.ims_be.config.CustomSqlDateDeserializer;
import com.ims.ims_be.enums.Benefit;
import com.ims.ims_be.enums.Level;
import com.ims.ims_be.enums.Skill;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobInListDto {
    private Integer updatedBy;
    private Integer id;
    private String title;
    private List<Skill> skills;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date startDate;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date endDate;
    private List<Level> levels;
    private String status;
    private List<Benefit> benefits;
}
