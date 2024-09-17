package com.ims.ims_be.service.user;

import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.dto.user.UserDetailDto;
import com.ims.ims_be.dto.user.UserListDto;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.enums.UserStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    Page<UserListDto> getUsers(String searchTerm, String role, int page, int size);
    List<UserOptionResponseDto> getRecruiters();
    List<UserListDto> getUserLists();
    UserDetailDto getUserById(Integer id);
    UserDetailDto createUser(User user);
    UserDetailDto editUser(Integer id,UserDetailDto user);
    UserDetailDto updateStatusUser(Integer id, UserStatus status);
}
