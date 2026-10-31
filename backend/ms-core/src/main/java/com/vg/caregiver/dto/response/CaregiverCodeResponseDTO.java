package com.vg.caregiver.dto.response;

import java.util.UUID;

/**
 * Response returned when a protected user generates a new invitation code.
 */
public record CaregiverCodeResponseDTO(
    UUID code
) {}