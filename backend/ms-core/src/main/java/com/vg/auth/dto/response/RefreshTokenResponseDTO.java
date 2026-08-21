package com.vg.auth.dto.response;

public record RefreshTokenResponseDTO(
    String token,
    String message
) {}
