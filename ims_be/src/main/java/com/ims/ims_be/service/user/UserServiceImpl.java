package com.ims.ims_be.service.user;

import com.ims.ims_be.dto.user.UserOptionResponseDto;
import com.ims.ims_be.dto.user.UserDetailDto;
import com.ims.ims_be.dto.user.UserListDto;
import com.ims.ims_be.entity.Account;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.enums.Role;
import com.ims.ims_be.enums.UserStatus;
import com.ims.ims_be.mapper.UserMapper;
import com.ims.ims_be.repository.AccountRepository;
import com.ims.ims_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.text.Normalizer.Form;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final UserMapper userMapper;

    private static final String CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";

    private static final SecureRandom random = new SecureRandom();

    @Override
    public Page<UserListDto> getUsers(String searchTerm, String role, int pageNumber, int pageSize){
        int validPageNumber = Math.max(pageNumber, 0);
        int validPageSize = 10;
        Pageable pageable = PageRequest.of(validPageNumber, validPageSize, Sort.by("role", "account.username").ascending());
        Role roleEnum;

        if (searchTerm != null && !searchTerm.isBlank() && role != null && !role.isBlank()) {
            roleEnum = Role.valueOf(role);
            return userMapper.usersToListDto(
                    userRepository.findByFullNameContainingAndRole(searchTerm, roleEnum, pageable));
        }
        if (searchTerm != null && !searchTerm.isBlank()) {
            return userMapper.usersToListDto(
                    userRepository.findByFullNameContaining(searchTerm, pageable));
        }
        if (role != null && !role.isBlank()) {
            roleEnum = Role.valueOf(role);
            return userMapper.usersToListDto(
                    userRepository.findByRole(roleEnum, pageable));
        }
        return userMapper.usersToListDto(
                userRepository.findAll(pageable));
    }
    public List<UserOptionResponseDto> getRecruiters() {
        List<User> users = userRepository.findAllUsersWithAccountsByRole(Role.RECRUITER);
        return userMapper.usersToRecruiterDtos(users);
    }
    public List<UserListDto> getUserLists() {
        List<User> users = userRepository.findAll();
        return userMapper.usersToUserListDtos(users);
    }

    public UserDetailDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id: " + id + " not found"));

        return userMapper.userToDetailDto(user);
    }


    public UserDetailDto createUser(User user){
        if(userRepository.existsByEmail(user.getEmail())){
            System.out.println("have exception");
            throw new RuntimeException("email already exists");
        }
        Account account = new Account();
        account.setUsername(generateUniqueUsername(user.getFullName()));
        account.setPassword(generateRandomPassword(12));
        user.setAccount(accountRepository.save(account));


        return userMapper.userToDetailDto(userRepository.save(user));
    }

    @Override
    public UserDetailDto editUser(Integer id, UserDetailDto userDetailDto) {
        User userExit = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        if (updatedJob.getTitle() == null) {
//            throw new IllegalArgumentException("Title is required");
//        }

        userMapper.updateUser(userExit, userDetailDto);

        return userMapper.userToDetailDto(userRepository.save(userExit));
    }

    public UserDetailDto updateStatusUser(Integer id, UserStatus status){
        User userExit = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userExit.setUserStatus(status);

        return userMapper.userToDetailDto(userRepository.save(userExit));
    }

    private String generateRandomPassword(int length) {
        if (length < 8) {
            throw new IllegalArgumentException("password must be at least 8 character");
        }

        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(CHAR_SET.length());
            password.append(CHAR_SET.charAt(randomIndex));
        }

        return password.toString();
    }

    private String generateUniqueUsername(String fullName) {
        String baseUsername = generateBaseUsername(removeAccents(fullName));
        Optional<String> lastUsername = accountRepository.findLastUsernameByExactPrefix(baseUsername);

        if (lastUsername.isPresent()) {
            String lastUsernameStr = lastUsername.get();
            int nextNumber = extractNumber(lastUsernameStr).map(num -> num + 1).orElse(2);
            System.out.println(nextNumber);
            return baseUsername + nextNumber;
        } else {
            return baseUsername;
        }
    }

    private String generateBaseUsername(String fullName) {
        String[] nameParts = fullName.trim().split("\\s+");
        if (nameParts.length < 2) {
            throw new IllegalArgumentException("");
        }

        String firstName = nameParts[nameParts.length - 1];
        StringBuilder initials = new StringBuilder();
        for (int i = 0; i < nameParts.length - 1; i++) {
            initials.append(Character.toUpperCase(nameParts[i].charAt(0)));
        }

        return firstName + initials.toString();
    }

    private Optional<Integer> extractNumber(String username) {
        String baseUsername = username.replaceAll("\\d+$","");
        Pattern pattern = Pattern.compile( Pattern.quote(baseUsername)+ "(\\d+)$");
        Matcher matcher = pattern.matcher(username);
        if (matcher.find()) {
            return Optional.of(Integer.parseInt(matcher.group(1)));
        }
        return Optional.empty();
    }

    public User findUserByUserId(String userId) {
        return userRepository.findById(Integer.parseInt(userId)).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private static String removeAccents(String text) {
        if (text == null) return null;
        text = text.replace("Đ", "D")
                .replace("Â", "A")
                .replace("Ê", "E")
                .replace("Ô", "O")
                .replace("Ă", "A")
                .replace("Ơ", "O")
                .replace("Ư", "U");
        String normalized = Normalizer.normalize(text, Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

}
