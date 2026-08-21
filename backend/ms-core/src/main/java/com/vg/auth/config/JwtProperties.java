package com.vg.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration properties for JWT (JSON Web Token) settings.
 * 
 * This class maps properties from application.yml with the prefix "jwt".
 * 
 * Example application.yml configuration:
 * 
 * jwt:
 *   secret: ${JWT_SECRET:mySecretKey123}
 *   expiration: 86400000
 *   issuer: ms-core
 * 
 * Spring Boot automatically binds properties from the configuration file
 * to the fields of this class using the @ConfigurationProperties annotation.
 * 
 * Environment variables can override values using the ${VAR_NAME:default}
 * syntax, allowing for secure secret management in production.
 */
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    
    /**
     * The secret key used to sign JWT tokens.
     * 
     * This should be a strong, unique key that is kept secret.
     * In production, this should be set as an environment variable
     * rather than hardcoded in the configuration file.
     * 
     * Example: JWT_SECRET=your-super-secret-key-1234567890
     */
    private String secret;

    /**
     * Token expiration time in milliseconds.
     * 
     * Default is 86400000 ms = 24 hours.
     * 
     * Common values:
     * - 900000  = 15 minutes (short-lived token)
     * - 3600000 = 1 hour
     * - 86400000 = 24 hours (default)
     * - 604800000 = 7 days (remember me)
     */
    private Long expiration;

    /**
     * The issuer identifier for the token.
     * 
     * This identifies which application or service issued the token.
     * Used for validation to ensure tokens are from a trusted source.
     * 
     * Example: ms-core, auth-service, etc.
     */
    private String issuer;

    // ============================================
    // GETTERS AND SETTERS
    // (Required by Spring Boot for property binding)
    // ============================================

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public Long getExpiration() {
        return expiration;
    }

    public void setExpiration(Long expiration) {
        this.expiration = expiration;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }
}