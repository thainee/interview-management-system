package com.ims.ims_be.dto.offer;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OfferListEntityResponseDto {
    private Integer id;
    private String name;
    private String email;
    private String approver;
    private String department;
    private String note;
    private String status;
}
