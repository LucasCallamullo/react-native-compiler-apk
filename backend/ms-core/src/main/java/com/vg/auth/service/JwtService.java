package com.vg.auth.service;

import com.vg.auth.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
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
     * Generates an access JWT token for the given email.
     *
     * @param email the user email
     * @return the generated JWT token
     */
    public String generateAccessToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "access");
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Generates an access JWT token with custom claims.
     *
     * @param email the user email
     * @param claims additional claims to include
     * @return the generated JWT token
     */
    public String generateAccessToken(String email, Map<String, Object> claims) {
        claims.put("email", email);
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "access");
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Generates a refresh JWT token with longer expiration (7 days).
     *
     * @param email the user email
     * @return the generated refresh token
     */
    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "refresh");
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Generates a refresh token with custom claims.
     *
     * @param email the user email
     * @param claims additional claims to include
     * @return the generated refresh token
     */
    public String generateRefreshToken(String email, Map<String, Object> claims) {
        claims.put("email", email);
        claims.put("issuer", jwtProperties.getIssuer());
        claims.put("type", "refresh");
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Validates a JWT token.
     *
     * @param token the JWT token
     * @param email the expected email
     * @return true if the token is valid
     */
    public boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    /**
     * Extracts the email from the JWT token.
     *
     * @param token the JWT token
     * @return the email
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
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
     * Checks if the token is expired.
     *
     * @param token the JWT token
     * @return true if expired
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
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