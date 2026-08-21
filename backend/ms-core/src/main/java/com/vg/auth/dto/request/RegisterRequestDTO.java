package com.vg.auth.dto.request;

// import com.vg.auth.model.UserRole;
import jakarta.validation.constraints.*;

public record RegisterRequestDTO(

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
    String phone

) {}
