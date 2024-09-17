package com.ims.ims_be.dto.schedule;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewerDto {
    private Integer id;
    private String fullName;
    private String userName;
    private String email;
}
