package com.ims.ims_be.repository;

import com.ims.ims_be.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    @Query(value = "SELECT username FROM account WHERE username RLIKE CONCAT('^', :prefix, '([0-9]+)?$') ORDER BY LENGTH(username) DESC, username DESC LIMIT 1", nativeQuery = true)
    Optional<String> findLastUsernameByExactPrefix(@Param("prefix") String prefix);

    Optional<Account> findByResetPasswordToken(String token);
}
