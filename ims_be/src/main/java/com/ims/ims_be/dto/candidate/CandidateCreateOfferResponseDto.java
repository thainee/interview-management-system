package com.ims.ims_be.dto.candidate;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CandidateCreateOfferResponseDto {
    String candidateId;
    String candidateName;
    String interviewInfo;
    String interviewNote;
}
