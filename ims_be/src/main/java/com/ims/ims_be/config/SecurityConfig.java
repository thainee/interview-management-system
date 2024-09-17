package com.ims.ims_be.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**"
    };

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/schedules", "/api/schedules/**").hasAnyRole("ADMIN", "RECRUITER", "MANAGER", "INTERVIEWER")
                        .requestMatchers(HttpMethod.POST, "/api/schedules").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/schedules/*/edit").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/schedules/*/submit").hasAnyRole("INTERVIEWER")
                        .requestMatchers(HttpMethod.POST, "/api/schedules/send-reminder").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "api/jobs", "/api/jobs/**").permitAll()
                        .requestMatchers("api/jobs/**").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/api/offers/**").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/offers/**").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/*").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/sent/*").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/accept/*").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/decline/*").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/cancel/*").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/approve/*").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/offers/reject/*").hasAnyRole("ADMIN", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/api/candidates", "/api/candidates/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/candidates/*/edit").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/candidates/*/create").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/candidates/*/ban").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/candidates/*/delete").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")

                        .requestMatchers(HttpMethod.GET, "/api/users/recruiters").hasAnyRole("ADMIN", "RECRUITER", "MANAGER")
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .anyRequest().authenticated());

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
        );

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }


    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }


}
