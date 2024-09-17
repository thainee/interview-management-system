package com.ims.ims_be.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfferListResponseDto {
    private List<OfferListEntityResponseDto> content;
    private int totalPages;
    private int number;
    private int size;
}
