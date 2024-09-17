package com.ims.ims_be.dto.candidate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateInListDto {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String position;
    private String ownerHR;
    private String status;
}
