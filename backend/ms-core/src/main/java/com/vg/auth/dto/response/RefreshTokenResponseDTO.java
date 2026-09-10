package com.vg.auth.dto.response;

/**
 * Data Transfer Object returned after a successful token refresh operation.
 * Contains the newly generated access token and refresh token pair.
 *
 * @param accessToken  the newly issued JWT access token
 * @param refreshToken the new (or rotated) long-lived refresh token
 * @param tokenType    the authorization scheme (e.g., "Bearer")
 * @param expiresIn    the access token validity duration in milliseconds
 * @param message      a message describing the outcome of the refresh operation
 */
public record RefreshTokenResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    String message
) {
    /**
     * Convenience constructor that automatically defaults tokenType to "Bearer".
     *
     * @param accessToken  the newly issued JWT access token
     * @param refreshToken the new (or rotated) long-lived refresh token
     * @param expiresIn    the access token validity duration in milliseconds
     * @param message      a message describing the outcome of the refresh operation
     */
    public RefreshTokenResponseDTO(String accessToken, String refreshToken, Long expiresIn, String message) {
        this(accessToken, refreshToken, "Bearer", expiresIn, message);
    }
}