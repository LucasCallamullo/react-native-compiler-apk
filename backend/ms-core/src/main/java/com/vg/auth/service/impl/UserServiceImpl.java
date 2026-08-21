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

    /**
     * Validates that an email is not already used by another user.
     * Used during update operations to exclude the current user from the check.
     *
     * @param email the email to check
     * @param userId the user ID to exclude from the check
     * @throws AppException with 409 CONFLICT if email is used by another user
     */
    @Override
    public void validateEmailUniqueForUpdate(String email, Long userId) {
        if (userRepository.existsByEmailAndIdNot(email, userId)) {
            throw new AppException("Email already in use: " + email, HttpStatus.CONFLICT);
        }
    }

    /**
     * Validates that a DNI is not already used by another user.
     * Used during update operations to exclude the current user from the check.
     *
     * @param dni the DNI to check
     * @param userId the user ID to exclude from the check
     * @throws AppException with 409 CONFLICT if DNI is used by another user
     */
    @Override
    public void validateDniUniqueForUpdate(String dni, Long userId) {
        if (userRepository.existsByDniAndIdNot(dni, userId)) {
            throw new AppException("DNI already in use: " + dni, HttpStatus.CONFLICT);
        }
    }

    /**
     * Validates that a user exists by ID and returns the user entity.
     * Reusable method used across multiple service operations.
     *
     * @param id the user ID to find
     * @return the User entity if found
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public User validateUserExists(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new AppException("User not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    // ============================================
    // ENTITY METHODS
    // ============================================

    /**
     * Retrieves a user entity by ID.
     * Wrapper around validateUserExists for internal use.
     *
     * @param id the user ID
     * @return the User entity
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public User getUserEntityById(Long id) {
        return validateUserExists(id);
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
    public Optional<User> findUserByDni(String dni) {
        return userRepository.findByDni(dni);
    }

    // ============================================
    // CRUD METHODS
    // ============================================

    /**
     * Creates a new user.
     *
     * @param dto the user data
     * @return the created user data
     * @throws AppException with 409 CONFLICT if email or DNI already exists
     */
    @Override
    @Transactional
    public UserResponseDTO createUser(UserRequestDTO dto) {
        // Step 1: Validate email is unique
        validateEmailUnique(dto.email());
        
        // Step 2: Validate DNI is unique
        validateDniUnique(dto.dni());

        // Step 3: Map DTO to Entity
        User user = userMapper.toEntity(dto);
        
        // Step 4: Encrypt password using BCrypt (never store plain text passwords!)
        user.setPassword(passwordEncoder.encode(dto.password()));
        
        // Step 5: Save to database
        User savedUser = userRepository.save(user);
        
        // Step 6: Return as DTO
        return userMapper.toResponseDTO(savedUser);
    }

    /**
     * Retrieves a user by ID and returns as DTO.
     *
     * @param id the user ID
     * @return the user data
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = validateUserExists(id);
        return userMapper.toResponseDTO(user);
    }

    /**
     * Retrieves a user by email.
     *
     * @param email the user email
     * @return the user data
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new AppException("User not found with email: " + email, HttpStatus.NOT_FOUND));
        return userMapper.toResponseDTO(user);
    }

    /**
     * Retrieves a user by DNI.
     *
     * @param dni the user DNI
     * @return the user data
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public UserResponseDTO getUserByDni(String dni) {
        User user = userRepository.findByDni(dni)
            .orElseThrow(() -> new AppException("User not found with DNI: " + dni, HttpStatus.NOT_FOUND));
        return userMapper.toResponseDTO(user);
    }

    /**
     * Retrieves all users.
     *
     * @return list of all user data
     */
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(userMapper::toResponseDTO)
            .collect(Collectors.toList());
    }

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
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {
        // Step 1: Validate user exists
        User user = validateUserExists(id);

        // Step 2: Validate email is unique (excluding current user)
        validateEmailUniqueForUpdate(dto.email(), id);
        
        // Step 3: Validate DNI is unique (excluding current user)
        validateDniUniqueForUpdate(dto.dni(), id);

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
    public boolean deleteUser(Long id) {
        // Step 1: Validate user exists
        validateUserExists(id);
        
        // Step 2: Delete from database
        userRepository.deleteById(id);
        
        // Step 3: Return success
        return true;
    }
}