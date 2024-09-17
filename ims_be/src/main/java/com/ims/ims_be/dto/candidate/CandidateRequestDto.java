package com.ims.ims_be.dto.candidate;

import com.ims.ims_be.utils.AppConstants;
import com.ims.ims_be.validation.Adult;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
public class CandidateRequestDto {
    private Integer id;
    @NotBlank(message = "Name should not be null or blank")
    private String fullName;

    @NotBlank(message = "Email should not be null or blank")
    @Email(message = "Invalid email")
    private String email;

    @NotNull(message = "DOB should not be null")
    @Past(message = "DOB must be in the past")
    @Adult(message = "Candidate must be at least 18 years old")
    private Date dob;

    @NotBlank(message = "Address should not be null or blank")
    private String address;

    @NotBlank(message = "Phone number should not be null or blank")
    @Size(min = 9, message = "Please enter a valid phone number")
    @Pattern(regexp = AppConstants.PHONE_REGEX, message = "Please enter a valid phone number")
    private String phoneNumber;

    @NotNull(message = "Gender should not be null")
    private String gender;

    private String cv;

    @Size(max = 500, message = "Note can not have more than 500 characters")
    private String note;

    @NotNull(message = "Position should not be null")
    private String position;

    private Integer experience;

    @NotNull(message = "Recruiter ID should not be null")
    @Min(value = 0, message = "Invalid recruiter ID")
    private Integer recruiterId;

    @NotNull(message = "Skill should not be null")
    private List<String> skills;

    @NotNull(message = "Highest level should not be null")
    private String highestLevel;

    @NotNull(message = "Updated by should not be null")
    @Min(value = 0, message = "Invalid user ID")
    private Integer updatedBy;
}
