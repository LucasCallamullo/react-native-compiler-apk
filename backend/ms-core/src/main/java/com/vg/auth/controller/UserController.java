package com.vg.auth.controller;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;

import com.vg.auth.security.UserPrincipal;
import com.vg.shared.security.Roles;

import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO updateUser(
        @AuthenticationPrincipal UserPrincipal principal,
        @PathVariable UUID id,
        @Valid @RequestBody UserRequestDTO dto) {

        List<String> roles = principal.getRoles();
        
        if (!id.equals(principal.getUserId()) && !Roles.isAdmin(roles)) {
            throw new AppException("You can only update your own profile", HttpStatus.FORBIDDEN);
        }
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteUser(
        @AuthenticationPrincipal UserPrincipal principal, 
        @PathVariable UUID id) {

        List<String> roles = principal.getRoles();
        
        if (!id.equals(principal.getUserId()) && !Roles.isAdmin(roles)) {
            throw new AppException("You can only delete your own profile", HttpStatus.FORBIDDEN);
        }

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
    @PreAuthorize("isAuthenticated()")
    public UserResponseDTO getUserById(
        @AuthenticationPrincipal UserPrincipal principal, 
        @PathVariable UUID id) {

        List<String> roles = principal.getRoles();
        
        if (!id.equals(principal.getUserId()) && !Roles.isAdmin(roles)) {
            throw new AppException("You can only get your own profile", HttpStatus.FORBIDDEN);
        }

        return userService.getUserById(id);
    }

    /**
     * Retrieves all users from the system.
     *
     * @return a list of all users with HTTP 200 OK status
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }
}