package com.ims.ims_be.mapper;

import com.ims.ims_be.dto.schedule.InterviewerDto;
import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.dto.user.UserDetailDto;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.enums.Department;
import com.ims.ims_be.enums.Gender;
import com.ims.ims_be.enums.Role;
import com.ims.ims_be.enums.UserStatus;
import com.ims.ims_be.dto.user.UserListDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Named("mapRole")
    default String mapRole(Role role){
        return role != null? role.name():null;
    }
    @Named("mapStatus")
    default String mapStatus(UserStatus status){
        return status != null? status.name():null;
    }
    @Named("mapDepartment")
    default String mapDepartment(Department department){
        return department != null? department.name():null;
    }
    @Named("mapGender")
    default String mapGender(Gender gender){
        return gender != null? gender.name():null;
    }
    @Named("roleToEnum")
    default Role roleToEnum(String role) {
        if (role == null || role.isEmpty()) {
            return null;
        }
        try {
            return Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Log error or handle invalid role string
            return null;
        }
    }
    @Named("departmentToEnum")
    default Department departmentToEnum(String department) {
        if (department == null || department.isEmpty()) {
            return null;
        }
        try {
            return Department.valueOf(department.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Log error or handle invalid role string
            return null;
        }
    }
    @Named("genderToEnum")
    default Gender genderToEnum(String gender) {
        if (gender == null || gender.isEmpty()) {
            return null;
        }
        try {
            return Gender.valueOf(gender.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Log error or handle invalid role string
            return null;
        }
    }
    @Named("statusToEnum")
    default UserStatus statusToEnum(String status) {
        if (status == null || status.isEmpty()) {
            return null;
        }
        try {
            return UserStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Log error or handle invalid role string
            return null;
        }
    }



    @Mapping(target = "displayName", expression = "java(user.getFullName() + \" (\" + user.getAccount().getUsername() + \")\")")
    UserOptionResponseDto userToRecruiterDto(User user);

    List<UserOptionResponseDto> usersToRecruiterDtos(List<User> users);
    @Mapping(source = "account.username", target = "userName")
    @Mapping(source = "role", target = "role", qualifiedByName = "mapRole")
    @Mapping(source = "userStatus", target = "status", qualifiedByName = "mapStatus")
    UserListDto userToUserDto(User user);
    default Page<UserListDto> usersToListDto(Page<User> users) {
        return users.map(this::userToUserDto);
    }

    @Mapping(source = "role", target = "role", qualifiedByName = "mapRole")
    @Mapping(source = "department", target = "department", qualifiedByName = "mapDepartment")
    @Mapping(source = "gender", target = "gender", qualifiedByName = "mapGender")
    @Mapping(source = "userStatus", target = "status", qualifiedByName = "mapStatus")
    UserDetailDto userToDetailDto(User user);

    @Mapping(source = "role", target = "role", qualifiedByName = "roleToEnum")
    @Mapping(source = "department", target = "department", qualifiedByName = "departmentToEnum")
    @Mapping(source = "gender", target = "gender", qualifiedByName = "genderToEnum")
    @Mapping(source = "status", target = "userStatus", qualifiedByName = "statusToEnum")
    User userDetailToUser(UserDetailDto dto);

    @Mapping(source = "role", target = "role", qualifiedByName = "roleToEnum")
    @Mapping(source = "department", target = "department", qualifiedByName = "departmentToEnum")
    @Mapping(source = "gender", target = "gender", qualifiedByName = "genderToEnum")
    @Mapping(source = "status", target = "userStatus", qualifiedByName = "statusToEnum")
    void updateUser(@MappingTarget User user, UserDetailDto userDetailDto);

    List<UserListDto> usersToUserListDtos(List<User> users);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "fullName", source = "fullName")
    @Mapping(target = "userName", source = "user.account.username")
    InterviewerDto userToInterviewerDto(User user);

    List<InterviewerDto> usersToInterviewerDtos(List<User> users);
}
