package com.vg.auth.service.impl;

import com.vg.auth.dto.request.UserRequestDTO;
import com.vg.auth.dto.response.UserResponseDTO;
import com.vg.auth.mapper.UserMapper;
import com.vg.auth.model.User;
import com.vg.auth.repository.UserRepository;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of UserService.
 * Handles all user-related business logic including CRUD operations,
 * validation, and password encryption.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    // Injected from config/PasswordEncoderConfig.java for password hashing
    private final PasswordEncoder passwordEncoder;

    // ============================================
    // VALIDATION METHODS (Reusable across the service)
    // ============================================

    /**
     * Validates that an email is not already registered.
     *
     * @param email the email to check
     * @throws AppException with 409 CONFLICT if email already exists
     */
    @Override
    public void validateEmailUnique(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new AppException("User already exists with email: " + email, HttpStatus.CONFLICT);
        }
    }

    /**
     * Validates that a DNI is not already registered.
     *
     * @param dni the DNI to check
     * @throws AppException with 409 CONFLICT if DNI already exists
     */
    @Override
    public void validateDniUnique(String dni) {
        if (userRepository.existsByDni(dni)) {
            throw new AppException("User already exists with DNI: " + dni, HttpStatus.CONFLICT);
        }
    }

    // ============================================
    // ENTITY METHODS
    // ============================================

    /**
     * Retrieves a user entity by ID.
     * Wrapper around validateUserExists for internal use.
     *
     * @param id the user ID
     * @return {User} entity
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public User findUserByIdWithRoles(UUID id) {
        return userRepository.findUserByIdWithRoles(id)
            .orElseThrow(() -> new AppException("User Not Found With ID: " + id, HttpStatus.NOT_FOUND));
    }

    public User validateUserExists(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new AppException("User Not Found With ID: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findUserByEmailWithRoles(String email) {
        return userRepository.findByEmailWithRoles(email);
    }

    // ============================================
    //    METHODS    |        UPDATE - DELETE
    // ============================================

    /**
     * Updates an existing user.
     *
     * @param id the user ID to update
     * @param dto the updated user data
     * @return the updated user data
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     * @throws AppException with 409 CONFLICT if email or DNI is used by another user
     */
    @Override
    @Transactional
    public UserResponseDTO updateUser(UUID id, UserRequestDTO dto) {
        // Step 1: Validate user exists
        User user = findUserByIdWithRoles(id);

        // Step 2: Validate email is unique (excluding current user)
        if (userRepository.existsByEmailAndIdNot(dto.email(), id)) {
            throw new AppException("Email already in use: " + dto.email(), HttpStatus.CONFLICT);
        }
        
        // Step 3: Validate DNI is unique (excluding current user)
        if (userRepository.existsByDniAndIdNot(dto.dni(), id)) {
            throw new AppException("DNI already in use: " + dto.dni(), HttpStatus.CONFLICT);
        }

        // Step 4: Map DTO to existing entity (updates firstName, lastName, etc.)
        userMapper.updateEntity(dto, user);
        
        // Step 5: If password is provided, encrypt it (BCrypt)
        if (dto.password() != null && !dto.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.password()));
        }
        
        // Step 6: Save to database
        User updatedUser = userRepository.save(user);
        
        // Step 7: Return as DTO
        return userMapper.toResponseDTO(updatedUser);
    }

    /**
     * Deletes a user by ID.
     *
     * @param id the user ID to delete
     * @return true if successful
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    @Transactional
    public boolean deleteUser(UUID id) {
        // Step 1: Validate user exists
        findUserByIdWithRoles(id);
        
        // Step 2: Delete from database
        userRepository.deleteById(id);
        
        // Step 3: Return success
        return true;
    }

    // ============================================
    //    METHODS    |       GET
    // ============================================

    /**
     * Retrieves a user by ID and returns as DTO.
     *
     * @param id the user ID
     * @return the user data
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public UserResponseDTO getUserById(UUID id) {
        User user = findUserByIdWithRoles(id);
        return userMapper.toResponseDTO(user);
    }

    /**
     * Retrieves all users.
     *
     * @return list of all user data
     */
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAllWithRoles().stream()
            .map(userMapper::toResponseDTO)
            .collect(Collectors.toList());
    }
}