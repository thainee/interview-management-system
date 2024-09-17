package com.ims.ims_be.repository;

import com.ims.ims_be.entity.Account;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.entity.candidate.Candidate;
import com.ims.ims_be.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Page<User> findByFullNameContaining(String searchTerm, Pageable pageable);
    Page<User> findByFullNameContainingAndRole(String searchTerm, Role role, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);

    @Query("SELECT u FROM User u JOIN FETCH u.account WHERE u.role = :role")
    List<User> findAllUsersWithAccountsByRole(@Param("role") Role role);

    Optional<User> findByAccount_Username(String accountUserName);

    List<User> findByRole(Role role);
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}