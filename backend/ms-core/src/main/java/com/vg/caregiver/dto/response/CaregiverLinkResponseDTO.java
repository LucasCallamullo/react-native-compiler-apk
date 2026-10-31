package com.vg.caregiver.dto.response;

import com.vg.caregiver.model.CaregiverLinkStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Response DTO for a CaregiverLink, exposing only what the client needs.
 */
public record CaregiverLinkResponseDTO(
    UUID id,
    UUID protectedUserId,
    String protectedUserName,
    UUID caregiverId,
    String caregiverName,
    CaregiverLinkStatus status,
    LocalDateTime createdAt,
    LocalDateTime acceptedAt
) {}