package com.ims.ims_be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserListDto {
    private Integer id;
    private String userName;
    private String email;
    private String phoneNumber;
    private String status;
    private String role;
}
