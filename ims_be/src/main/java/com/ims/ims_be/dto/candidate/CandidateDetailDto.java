package com.ims.ims_be.dto.candidate;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class CandidateDetailDto {
    private Integer id;
    private String fullName;
    private String email;
    private Date dob;
    private String address;
    private String phoneNumber;
    private String gender;
    private String cvCandidate;
    private String note;
    private String position;
    private String status;
    private Integer experience;
    private String recruiterDisplayName;
    private List<String> skills;
    private String highestLevel;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String updatedBy;
}