package com.vg.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuration class that provides the PasswordEncoder bean.
 * 
 * Why is this needed?
 * 
 * 1. PasswordEncoder is an interface, not a concrete class.
 *    Spring cannot instantiate an interface directly.
 * 
 * 2. We need to tell Spring which implementation to use.
 *    BCryptPasswordEncoder is the recommended implementation.
 * 
 * 3. This bean is then injected into services that need password encoding.
 * 
 * Without this configuration, Spring will throw an error when trying to inject
 * PasswordEncoder because it doesn't know which implementation to use.
 * 
 * Error would be:
 * "No qualifying bean of type 'org.springframework.security.crypto.password.PasswordEncoder' available"
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * Creates a BCryptPasswordEncoder bean.
     * 
     * BCrypt is a secure hashing function designed for passwords.
     * Features:
     * - Slow by design (makes brute force attacks difficult)
     * - Includes a salt automatically (prevents rainbow table attacks)
     * - Configurable strength (default is 10 rounds)
     * 
     * @return PasswordEncoder instance using BCrypt algorithm
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}