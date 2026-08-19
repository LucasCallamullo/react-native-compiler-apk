package com.vg.auth.service;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.model.User;
import com.vg.shared.exception.AppException;

import java.util.List;

public interface UserService {

    /**
     * Retrieves a user entity by their ID.
     * Useful for internal operations that require the full entity.
     *
     * @param id the user ID
     * @return User entity
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    User getUserEntityById(Long id);

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
    UserResponseDTO getUserById(Long id);

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
    UserResponseDTO updateUser(Long id, UserRequestDTO dto);

    /**
     * Deletes a user by their ID.
     *
     * @param id the user ID to delete
     * @return true if the user was successfully deleted
     * @throws AppException if user not found (HTTP 404 Not Found)
     */
    boolean deleteUser(Long id);
}