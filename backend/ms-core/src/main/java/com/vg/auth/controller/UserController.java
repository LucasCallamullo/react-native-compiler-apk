package com.vg.auth.controller;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing user operations.
 * All endpoints are prefixed with /api/v1/users.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Creates a new user.
     *
     * @param dto the user data transfer object containing the user details
     * @return ResponseEntity containing the created user data with HTTP 201 Created status
     * @throws AppException if email or DNI already exists (HTTP 409 Conflict)
     */
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO dto) {
        UserResponseDTO user = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param id the user ID
     * @return ResponseEntity containing the user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves a user by their email address.
     *
     * @param email the user email
     * @return ResponseEntity containing the user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        UserResponseDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves a user by their DNI.
     *
     * @param dni the user DNI
     * @return ResponseEntity containing the user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @GetMapping("/dni/{dni}")
    public ResponseEntity<UserResponseDTO> getUserByDni(@PathVariable String dni) {
        UserResponseDTO user = userService.getUserByDni(dni);
        return ResponseEntity.ok(user);
    }

    /**
     * Retrieves all users from the system.
     *
     * @return ResponseEntity containing a list of all users with HTTP 200 OK status
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Updates an existing user.
     *
     * @param id the user ID to update
     * @param dto the DTO containing the updated user data
     * @return ResponseEntity containing the updated user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     * @throws AppException if email or DNI already in use by another user (HTTP 409 Conflict)
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO dto) {
        UserResponseDTO user = userService.updateUser(id, dto);
        return ResponseEntity.ok(user);
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id the user ID to delete
     * @return ResponseEntity with HTTP 204 No Content status if successfully deleted
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}