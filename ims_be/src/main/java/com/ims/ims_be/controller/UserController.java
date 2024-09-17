package com.ims.ims_be.controller;

import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.dto.user.UserDetailDto;
import com.ims.ims_be.dto.user.UserListDto;
import com.ims.ims_be.dto.user.UserStatusDto;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.enums.UserStatus;
import com.ims.ims_be.mapper.UserMapper;
import com.ims.ims_be.service.account.AccountService;
import com.ims.ims_be.service.authentication.UserChangeSerivce;
import com.ims.ims_be.service.mail.EmailSenderService;
import com.ims.ims_be.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final EmailSenderService emailSenderService;
    private final AccountService accountService;
    private final UserChangeSerivce userChangeSerivce;

    @GetMapping("/recruiters")
    public List<UserOptionResponseDto> getRecruiters() {
        return userService.getRecruiters();
    }

//    @GetMapping()
//    public List<UserListDto> getUserList() {
//        return userService.getUserLists();
//    }
    @GetMapping()
    public Page<UserListDto> searchUsers(
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String searchTerm, @RequestParam(required = false) String role
    ){
        return userService.getUsers(searchTerm,role,page,size);
    }

    @GetMapping("/{id}")
    public UserDetailDto getUserById(@PathVariable Integer id){
        return userService.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<UserDetailDto> addUser(@RequestBody UserDetailDto userDetailDto){
            User user = userMapper.userDetailToUser(userDetailDto);
            UserDetailDto createdUser = userService.createUser(user);

            emailSenderService.sendEmail(user.getEmail(),
                    "no-reply-email-IMS-system <"+user.getAccount().getUsername()+">",
                    "This email is from IMS system,Your account has been created. Please use the following credential to login:" +
                            "\n User name: "+ user.getAccount().getUsername()+" \nPassword: "+user.getAccount().getPassword()+
                    "\nThanks & Regards! \n" +
                            "IMS Team.");

            accountService.EncodePassword(user.getAccount());

            return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDetailDto> updateUser(@PathVariable Integer id, @RequestBody UserDetailDto userDetailDto){
        UserDetailDto editUser = userService.editUser(id, userDetailDto);
        return ResponseEntity.ok(editUser);
    }

    @PutMapping("/updateStatus/{id}")
    public ResponseEntity<UserDetailDto> updateStatus(@PathVariable Integer id, @RequestBody UserStatusDto data){
        System.out.println(data.getNewStatus());
        UserDetailDto editUser = userService.updateStatusUser(id, UserStatus.valueOf(data.getNewStatus()));
        userChangeSerivce.addChangedUser(id);
        return ResponseEntity.ok(editUser);
    }
}
