package com.vg.auth.service;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.model.User;
import com.vg.shared.exception.AppException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserService {

    // ============================================
    // VALIDATION METHODS (reutilizables)
    // ============================================

    /**
     * Validates that the email is not already in use.
     *
     * @param email the email to validate
     * @throws AppException if email already exists (HTTP 409 Conflict)
     */
    void validateEmailUnique(String email);

    /**
     * Validates that the DNI is not already in use.
     *
     * @param dni the DNI to validate
     * @throws AppException if DNI already exists (HTTP 409 Conflict)
     */
    void validateDniUnique(String dni);

    /**
     * Validates that the email is not already in use by another user.
     *
     * @param email the email to validate
     * @param userId the user ID to exclude from the check
     * @throws AppException if email already exists (HTTP 409 Conflict)
     */
    void validateEmailUniqueForUpdate(String email, UUID userId);

    /**
     * Validates that the DNI is not already in use by another user.
     *
     * @param dni the DNI to validate
     * @param userId the user ID to exclude from the check
     * @throws AppException if DNI already exists (HTTP 409 Conflict)
     */
    void validateDniUniqueForUpdate(String dni, UUID userId);

    /**
     * Validates that a user exists by ID.
     *
     * @param id the user ID
     * @return User entity
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    User validateUserExists(UUID id);

    // ============================================
    // ENTITY METHODS
    // ============================================

    /**
     * Saves a user entity.
     * Centralizes persistence logic for internal operations.
     *
     * @param user the user entity to save
     * @return the saved User entity
     */
    User save(User user);

    /**
     * Retrieves a user entity by their ID.
     * Useful for internal operations that require the full entity.
     *
     * @param id the user ID
     * @return User entity
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    User getUserEntityById(UUID id);

    /**
     * Finds a user by email.
     * Returns Optional to allow different error handling per use case.
     *
     * @param email the user email
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findUserByEmail(String email);

    /**
     * Finds a user by DNI.
     * Returns Optional to allow different error handling per use case.
     *
     * @param dni the user DNI
     * @return Optional containing the user if found, empty otherwise
     */
    Optional<User> findUserByDni(String dni);

    // ============================================
    // CRUD METHODS
    // ============================================

    /**
     * Creates a new user from the provided DTO.
     *
     * @param dto the user data transfer object containing the user details
     * @return UserResponseDTO containing the created user data
     * @throws AppException if email or DNI already exists (HTTP 409 Conflict)
     */
    UserResponseDTO createUser(UserRequestDTO dto);

    /**
     * Retrieves a user by their ID and returns as DTO.
     *
     * @param id the user ID
     * @return UserResponseDTO containing the user data
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    UserResponseDTO getUserById(UUID id);

    /**
     * Retrieves a user by their email.
     *
     * @param email the user email
     * @return UserResponseDTO containing the user data
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    UserResponseDTO getUserByEmail(String email);

    /**
     * Retrieves a user by their DNI.
     *
     * @param dni the user DNI
     * @return UserResponseDTO containing the user data
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    UserResponseDTO getUserByDni(String dni);

    /**
     * Retrieves all users from the system.
     *
     * @return List of UserResponseDTO containing all users
     */
    List<UserResponseDTO> getAllUsers();

    /**
     * Updates an existing user with the provided data.
     *
     * @param id the user ID to update
     * @param dto the DTO containing the updated user data
     * @return UserResponseDTO containing the updated user data
     * @throws AppException if user not found (HTTP 404 Not Found)
     * @throws AppException if email or DNI already in use by another user (HTTP 409 Conflict)
     */
    UserResponseDTO updateUser(UUID id, UserRequestDTO dto);

    /**
     * Deletes a user by their ID.
     *
     * @param id the user ID to delete
     * @return true if the user was successfully deleted
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    boolean deleteUser(UUID id);
}