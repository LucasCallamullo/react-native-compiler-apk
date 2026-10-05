package com.vg.auth.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


/**
 * Data Transfer Object representing user account details in API responses.
 *
 * @param id        the unique identifier of the user
 * @param firstName the user's first name
 * @param lastName  the user's last name
 * @param email     the user's email address
 * @param dni       the national identity document number
 * @param phone     the user's contact phone number
 * @param role      the role assigned to the user within the system
 * @param createdAt the timestamp indicating when the user account was created
 */
public record UserResponseDTO(
    UUID id,
    String firstName,
    String lastName,
    String email,
    String dni,
    String phone,
    List<String> roles,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}