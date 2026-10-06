package com.vg.auth.service;

import com.vg.auth.config.JwtProperties;
import com.vg.shared.exception.AppException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private final JwtProperties jwtProperties;
    private final SecretKey secretKey;

    // Refresh token expiration (7 days by default)
    private static final long REFRESH_TOKEN_EXPIRATION = 604800000L; // 7 days

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.secretKey = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
    }

    /**
     * Generates an access JWT token with custom claims.
     *
     * @param userId the user ID unique
     * @param claims additional claims to include
     * @return the generated JWT token
     */
    public String generateAccessToken(UUID userId, Map<String, Object> claims) {
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "access");
        
        return Jwts.builder()
                .claims(claims)
                .subject(userId.toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Generates a refresh JWT token with longer expiration (7 days).
     *
     * @param userId the user ID unique
     * @return the generated refresh token
     */
    public String generateRefreshToken(UUID userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "refresh");
        
        return Jwts.builder()
                .claims(claims)
                .subject(userId.toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Extracts the email from the JWT token.
     *
     * @param token the JWT token
     * @return the email
     */
    public UUID extractUserId(String token) {
        String subject = extractClaim(token, Claims::getSubject);
        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid user id in token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Extracts the email from the JWT token.
     *
     * @param token the JWT token
     * @return the email stored in the "email" claim
     */
    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    /**
     * Extracts the roles from the JWT token.
     *
     * @param token the JWT token
     * @return the list of role names stored in the "roles" claim, or empty list if absent
     */
    public List<String> extractRoles(String token) {
        Object roles = extractClaim(token, claims -> claims.get("roles"));
        if (roles instanceof List<?> list) {
            return list.stream().map(Object::toString).toList();
        }
        return List.of();
    }

    /**
     * Extracts the token type from the JWT token.
     *
     * @param token the JWT token
     * @return the token type ("access" or "refresh")
     */
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    /**
     * Extracts the expiration date from the JWT token.
     *
     * @param token the JWT token
     * @return the expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from the JWT token.
     *
     * @param token the JWT token
     * @param claimsResolver function to resolve the claim
     * @return the claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from the JWT token.
     *
     * @param token the JWT token
     * @return all claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Checks if a token is valid (not expired and properly signed).
     *
     * @param token the JWT token
     * @return true if the token is valid
     */
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Gets the expiration time in milliseconds for access tokens.
     *
     * @return the access token expiration in milliseconds
     */
    public Long getAccessTokenExpiration() {
        return jwtProperties.getExpiration();
    }

    /**
     * Gets the expiration time in milliseconds for refresh tokens.
     *
     * @return the refresh token expiration in milliseconds
     */
    public Long getRefreshTokenExpiration() {
        return REFRESH_TOKEN_EXPIRATION;
    }
}