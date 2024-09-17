package com.ims.ims_be.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OfferUpdateDetailResponseDto {
    private String candidateId;
    private String candidateName;
    private String contractType;
    private String contractFrom;
    private String contractTo;
    private String position;
    private String level;
    private String status;
    private String note;
    private String department;
    private String salary;
    private String approvedById;
    private String approvedByName;
    private String recruiterId;
    private String recruiterName;
    private String interviewInfo;
    private String interviewerNote;
    private String updatedBy;
    private String updatedAt;
    private String createdAt;
    private String dueDate;
}
