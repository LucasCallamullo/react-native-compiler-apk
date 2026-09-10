package com.vg.auth.dto.response;

import java.util.Optional;

/**
 * Data Transfer Object returned after successful authentication (login or registration).
 * Contains the access token, refresh token, token metadata, and user profile information.
 *
 * @param accessToken  the JWT access token used to authorize protected API requests
 * @param refreshToken the long-lived refresh token used to obtain a new access token
 * @param tokenType    the authorization scheme (e.g., "Bearer")
 * @param expiresIn    the access token validity duration in milliseconds
 * @param detail       an optional detailed message or contextual information regarding the authentication
 * @param user         the nested profile information of the authenticated user
 */
public record AuthResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    Optional<String> detail,
    UserResponseDTO user
) {
    /**
     * Convenience constructor that automatically defaults tokenType to "Bearer".
     *
     * @param accessToken  the JWT access token
     * @param refreshToken the long-lived refresh token
     * @param expiresIn    the access token validity duration in milliseconds
     * @param detail       an optional detailed message regarding the authentication outcome
     * @param user         the nested profile information of the authenticated user
     */
    // 1. Primary convenience constructor using Optional
    public AuthResponseDTO(
        String accessToken, 
        String refreshToken, 
        Long expiresIn, 
        Optional<String> detail, 
        UserResponseDTO user) {
        
        this(accessToken, refreshToken, "Bearer", expiresIn, detail, user);
    }

    // 2. Additional constructor that converts a plain String to Optional
    public AuthResponseDTO(
        String accessToken, 
        String refreshToken, 
        Long expiresIn, 
        String detail, 
        UserResponseDTO user) {
        
        this(accessToken, refreshToken, "Bearer", expiresIn, Optional.ofNullable(detail), user);
    }
}