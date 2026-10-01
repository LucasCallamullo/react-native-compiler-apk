package com.vg.contact.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactResponseDTO(
    Long id,          // Cambió de UUID a Long
    String name,
    String email,
    String phone,
    UUID userId,
    LocalDateTime createdAt
) {}