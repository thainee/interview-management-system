package com.ims.ims_be.dto.candidate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CandidateListResponse {
    private List<CandidateInListDto> content;
    private int totalPages;
    private int number;
    private int size;
}
