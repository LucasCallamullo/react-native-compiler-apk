package com.vg.auth.dto.request;

import jakarta.validation.constraints.*;

import java.util.List;

import com.vg.auth.model.utils.RolType;

public record UserRequestDTO(

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    String firstName,

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 100, message = "Last name must be between 2 and 100 characters")
    String lastName,

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be less than 100 characters")
    String email,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20, message = "Password must be between 6 and 20 characters")
    String password,

    @NotBlank(message = "DNI is required")
    @Pattern(regexp = "^[0-9]{8,12}$", message = "DNI must contain only numbers and be between 8 and 12 digits")
    String dni,

    @Pattern(regexp = "^[0-9]{7,15}$", message = "Phone must contain only numbers and be between 7 and 15 digits")
    String phone,

    // Optional: if null/empty, USER role is assigned by default
    List<RolType> roles

) {

    /**
     * Validates that no ADMIN role is being assigned via API.
     * Returns true (valid) if roles is null/empty OR none of them is ADMIN.
     */
    @AssertTrue(message = "ADMIN role cannot be assigned via API")
    public boolean isRoleValid() {
        if (roles == null || roles.isEmpty()) {
            return true;
        }
        return roles.stream().noneMatch(r -> r == RolType.ADMIN);
    }

    /**
     * Returns the roles to assign, defaulting to USER if none were provided.
     */
    public List<RolType> getRolesOrDefault() {
        if (roles == null || roles.isEmpty()) {
            return List.of(RolType.USER);
        }
        return roles;
    }
}