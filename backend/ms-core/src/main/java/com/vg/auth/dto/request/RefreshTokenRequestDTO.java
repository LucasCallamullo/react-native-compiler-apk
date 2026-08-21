package com.vg.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequestDTO(
    @NotBlank(message = "Token is required")
    String token
) {}
