package com.ims.ims_be.controller;

import com.ims.ims_be.dto.authentication.*;
import com.ims.ims_be.service.authentication.AuthenticationService;
import com.ims.ims_be.service.authentication.UserChangeSerivce;
import com.ims.ims_be.service.user.UserService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.SecurityContext;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    UserChangeSerivce userChangeSerivce;
    UserService userService;

    @PostMapping("/login")
    AuthenticationResponse authenticate(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse result = authenticationService.authenticate(request);
        return result;
    }

    @PostMapping("/introspect")
    IntrospectResponse authenticate(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        IntrospectResponse result = authenticationService.introspect(request);
        return result;
    }

    @PostMapping("/logout")
    public IntrospectResponse logout(@RequestHeader("Authorization") String tokenString)
            throws ParseException, JOSEException {

        // Loại bỏ tiền tố "Bearer " nếu có
        if (tokenString.startsWith("Bearer ")) {
            tokenString = tokenString.substring(7);
        }

        IntrospectRequest introspectRequest = new IntrospectRequest(tokenString);
        authenticationService.logout(introspectRequest);
        return null;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity.ok("We've sent an email with the link to reset your password.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Your password has been successfully reset.");
    }
}
