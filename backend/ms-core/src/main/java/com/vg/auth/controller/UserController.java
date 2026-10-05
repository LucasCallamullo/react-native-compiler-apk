package com.vg.auth.controller;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Updates an existing user.
     *
     * @param id the user ID to update
     * @param dto the DTO containing the updated user data
     * @return the updated user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     * @throws AppException if email or DNI already in use by another user (HTTP 409 Conflict)
     */
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UserRequestDTO dto) {
        return userService.updateUser(id, dto);
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id the user ID to delete
     * @return HTTP 204 No Content
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ------------------------------------------------------------
    //            GET METHODS
    // ------------------------------------------------------------

    /**
     * Retrieves a user by their ID.
     *
     * @param id the user ID
     * @return the user data with HTTP 200 OK status
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable UUID id) {
        return userService.getUserById(id);
    }

    /**
     * Retrieves all users from the system.
     *
     * @return a list of all users with HTTP 200 OK status
     */
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }
}