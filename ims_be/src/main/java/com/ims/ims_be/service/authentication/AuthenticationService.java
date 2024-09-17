package com.ims.ims_be.service.authentication;

import com.ims.ims_be.dto.authentication.*;
import com.ims.ims_be.entity.InvalidatedToken;
import com.ims.ims_be.entity.User;
import com.ims.ims_be.repository.InvalidatedTokenRepository;
import com.ims.ims_be.entity.Account;
import com.ims.ims_be.exception.ResourceNotFoundException;
import com.ims.ims_be.repository.AccountRepository;
import com.ims.ims_be.repository.UserRepository;
import com.ims.ims_be.service.mail.EmailSenderService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    UserRepository userRepository;
    AccountRepository accountRepository;
    EmailSenderService emailSenderService;
    PasswordEncoder passwordEncoder;
    UserChangeSerivce userChangeSerivce;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;


    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token);

        } catch (RuntimeException e) {
            isValid=false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByAccount_Username(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not exits"));
        if(user.getUserStatus().name().equals("INACTIVE")){
            throw new RuntimeException("User not active");
        }

        Integer userId = user.getId();

        if(userChangeSerivce.hasUserChanged(userId)){
            userChangeSerivce.removeChangedUser(userId);
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(),
                user.getAccount().getPassword());

        if(!authenticated) {
            throw new RuntimeException("Invalid username or password");
        }

        var token= generateToken(user);
        log.info(token);
        return AuthenticationResponse.builder()
                .token(token)
                .build();
    }


    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getAccount().getUsername())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(30, ChronoUnit.MINUTES).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole())
                .claim("userId", user.getId())
                .claim("username", user.getAccount().getUsername())
                .claim("department", user.getDepartment())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    public void logout(IntrospectRequest request) throws ParseException, JOSEException {
        var signToken = verifyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        java.sql.Date sqlExpiryTime = new java.sql.Date(expiryTime.getTime());

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(sqlExpiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);
    }

    private SignedJWT verifyToken(String token) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expityTime.after(new Date())))
            throw new RuntimeException("UNAUTHENTICATED");

        if(invalidatedTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new RuntimeException("UNAUTHENTICATED");

        Integer userId = signedJWT.getJWTClaimsSet().getIntegerClaim("userId");

        if(userChangeSerivce.hasUserChanged(userId)){
            throw new RuntimeException("UNAUTHENTICATED");
        }

        return signedJWT;
    }



    public void sendResetPasswordEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("The email address doesn’t exist. Please try again."));

        String resetToken = generateResetToken();
        user.getAccount().setResetPasswordToken(resetToken);
        user.getAccount().setResetPasswordTokenExpiry(Instant.now().plus(1, ChronoUnit.HOURS));
        userRepository.save(user);

        String baseUrl = "http://localhost:3000/reset-password?token=";
        String resetLink = baseUrl + resetToken;
        String subject = "IMS Password Reset";
        String content = "We have just received a password reset request for " + email + "\n" +
                "Please click the link below to reset your password:\n" +
                resetLink + "\n" +
                "For your security, the link will expire in 1 hours or immediately after you reset your password.\n" +
                "Thanks & Regards!\n" +
                "IMS Team.";
        emailSenderService.sendEmail(user.getEmail(), subject, content);
    }

    public void resetPassword(ResetPasswordRequest request) {
        Account account = accountRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalStateException("This link has expired. Please go back to Homepage and try again."));

        if (account.getResetPasswordTokenExpiry().isBefore(Instant.now())) {
            throw new IllegalStateException("This link has expired. Please go back to Homepage and try again.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm password don't match. Please try again.");
        }

        if (!isPasswordValid(request.getNewPassword())) {
            throw new IllegalArgumentException("Password must contain at least one number, one numeral, and seven characters.");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        account.setResetPasswordToken(null);
        account.setResetPasswordTokenExpiry(null);
        accountRepository.save(account);
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private boolean isPasswordValid(String password) {
        // Password must contain at least one number, one letter, and be at least 7 characters long
        String regex = "^(?=.*[0-9])(?=.*[a-zA-Z]).{7,}$";
        return password.matches(regex);
    }
}
