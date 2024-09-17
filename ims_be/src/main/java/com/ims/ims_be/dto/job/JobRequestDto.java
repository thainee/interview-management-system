package com.ims.ims_be.dto.job;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.ims.ims_be.config.CustomSqlDateDeserializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JobRequestDto {
    private Integer updatedBy;
    private Integer id;
    private String title;
    private String address;
    private String description;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date endDate;
    private Double salaryFrom;
    private Double salaryTo;
//    @JsonDeserialize(using = CustomSqlDateDeserializer.class)
    private Date startDate;
    private List<String> benefits;
    private List<String> levels;
    private List<String> skills;
}
