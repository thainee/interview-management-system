package com.ims.ims_be.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfferCreateUpdateRequestDto {

    private String candidateId;
    private String contractType;
    private String contractFrom;
    private String contractTo;
    private String dueDate;
    private String position;
    private String level;
    private String note;
    private String department;
    private String salary;
    private String approvedById;
    private String recruiterId;
}
