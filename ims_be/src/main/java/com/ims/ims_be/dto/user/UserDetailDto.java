package com.ims.ims_be.dto.user;

import com.ims.ims_be.entity.Account;
import com.ims.ims_be.enums.Department;
import com.ims.ims_be.enums.Gender;
import com.ims.ims_be.enums.Role;
import com.ims.ims_be.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDetailDto {
    private Integer id;
    private String fullName;
    private String email;
    private Date dob;
    private String address;
    private String phoneNumber;
    private String gender;
    private String role;
    private String department;
    private String status;
    private String note;
}
