package com.vg.auth.dto.response;

import com.vg.auth.model.UserRole;

/**
 * Authentication response DTO returned after successful login or registration.
 * Contains JWT tokens and user information.
 */
public record AuthResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    String email,
    UserRole role,
    String firstName,
    String lastName,
    String message
) {
    /**
     * Convenience constructor that automatically sets tokenType to "Bearer".
     * 
     * Use this constructor when you want to follow the OAuth2 standard
     * without explicitly specifying "Bearer" each time.
     *
     * @param accessToken the JWT access token
     * @param refreshToken the refresh token
     * @param expiresIn the expiration time in milliseconds
     * @param email the user's email
     * @param role the user's role
     * @param firstName the user's first name
     * @param lastName the user's last name
     * @param message the result message
     */
    public AuthResponseDTO(String accessToken, String refreshToken, Long expiresIn, String email, UserRole role, String firstName, String lastName, String message) {
        this(accessToken, refreshToken, "Bearer", expiresIn, email, role, firstName, lastName, message);
    }
}