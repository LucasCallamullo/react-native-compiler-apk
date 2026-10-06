package com.vg.contact.dto.request;

import jakarta.validation.constraints.*;

public record ContactRequestDTO(

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    String email,

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{7,15}$", message = "Phone must contain only numbers and be between 7 and 15 digits")
    String phone
) {}