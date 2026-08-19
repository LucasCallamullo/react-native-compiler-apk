package com.vg.auth.dto.response;

import com.vg.auth.model.UserRole;

import java.time.LocalDateTime;

public record UserResponseDTO(
    Long id,
    String firstName,
    String lastName,
    String email,
    String dni,
    String phone,
    UserRole role,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}