package com.vg.auth.dto.response;

import com.vg.auth.model.UserRole;

public record AuthResponseDTO(
    String token,
    String email,
    UserRole role,
    String firstName,
    String lastName,
    String message
) {}