package com.vg.auth.dto.response;

/**
 * Response DTO for token refresh operations.
 * Returns a new access token and refresh token pair.
 */
public record RefreshTokenResponseDTO(
    String accessToken,
    String refreshToken,
    String tokenType,
    Long expiresIn,
    String message
) {
    public RefreshTokenResponseDTO(String accessToken, String refreshToken, Long expiresIn, String message) {
        this(accessToken, refreshToken, "Bearer", expiresIn, message);
    }
}