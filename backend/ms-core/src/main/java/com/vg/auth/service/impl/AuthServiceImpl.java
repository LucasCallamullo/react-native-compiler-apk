package com.vg.auth.service.impl;

import com.vg.auth.dto.request.LoginRequestDTO;
import com.vg.auth.dto.request.RefreshTokenRequestDTO;
import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.response.AuthResponseDTO;
import com.vg.auth.dto.response.RefreshTokenResponseDTO;
import com.vg.auth.model.User;
import com.vg.auth.model.UserRole;
import com.vg.auth.service.AuthService;
import com.vg.auth.service.JwtService;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Implementation of AuthService.
 * Handles authentication logic including login, registration, token refresh,
 * and token validation.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user with email and password.
     *
     * @param loginRequest the login credentials
     * @return AuthResponseDTO containing JWT token and user info
     * @throws AppException with 401 UNAUTHORIZED if credentials are invalid
     */
    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // Step 1: Find user by email
        User user = userService.findUserByEmail(loginRequest.email())
            .orElseThrow(() -> new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        // Step 2: Validate password using BCrypt
        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Step 3: Build claims for JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        // Step 4: Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), claims);

        // Step 5: Return authentication response
        return new AuthResponseDTO(
            token,
            user.getEmail(),
            user.getRole(),
            user.getFirstName(),
            user.getLastName(),
            "Login successful"
        );
    }

    /**
     * Registers a new user (public registration).
     *
     * @param registerRequest the registration data
     * @return AuthResponseDTO containing JWT token and user info
     * @throws AppException with 409 CONFLICT if email or DNI already exists
     */
    @Override
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO registerRequest) {
        // Step 1: Validate email is unique
        userService.validateEmailUnique(registerRequest.email());

        // Step 2: Validate DNI is unique
        userService.validateDniUnique(registerRequest.dni());

        // Step 3: Create user with USER role by default
        User user = User.builder()
            .firstName(registerRequest.firstName())
            .lastName(registerRequest.lastName())
            .email(registerRequest.email())
            .password(passwordEncoder.encode(registerRequest.password())) // Encrypt password
            .dni(registerRequest.dni())
            .phone(registerRequest.phone())
            .role(UserRole.USER) // Default role, ADMIN cannot be assigned via registration
            .build();

        // Step 4: Save user using UserService
        User savedUser = userService.save(user);

        // Step 5: Build claims for JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", savedUser.getRole().name());
        claims.put("userId", savedUser.getId());
        claims.put("email", savedUser.getEmail());
        claims.put("firstName", savedUser.getFirstName());
        claims.put("lastName", savedUser.getLastName());

        // Step 6: Generate JWT token
        String token = jwtService.generateToken(savedUser.getEmail(), claims);

        // Step 7: Return authentication response
        return new AuthResponseDTO(
            token,
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            "Registration successful"
        );
    }

    /**
     * Logs out a user.
     * In a stateless JWT system, logout is handled client-side.
     * This method is a placeholder for future token blacklisting.
     *
     * @param token the JWT token to invalidate
     * @return true if logout was successful
     */
    @Override
    public boolean logout(String token) {
        // In a stateless JWT system, logout is handled client-side by discarding the token.
        // For token blacklisting, we would need to store tokens in a cache/DB.
        // This is a placeholder for future implementation if needed.
        return true;
    }

    /**
     * Refreshes an expired JWT token.
     *
     * @param refreshRequest containing the expired/current token
     * @return RefreshTokenResponseDTO with a new JWT token
     * @throws AppException with 401 UNAUTHORIZED if token is invalid or expired
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public RefreshTokenResponseDTO refreshToken(RefreshTokenRequestDTO refreshRequest) {
        String token = refreshRequest.token();
        
        // Step 1: Validate the token
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // Step 2: Extract email from token
        String email = jwtService.extractEmail(token);
        
        // Step 3: Find user by email
        User user = userService.findUserByEmail(email)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Step 4: Build claims for new token
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        // Step 5: Generate new token
        String newToken = jwtService.generateToken(user.getEmail(), claims);

        // Step 6: Return response with new token
        return new RefreshTokenResponseDTO(
            newToken,
            "Token refreshed successfully"
        );
    }

    /**
     * Validates a JWT token.
     *
     * @param token the JWT token to validate
     * @return the email extracted from the token
     * @throws AppException with 401 UNAUTHORIZED if token is invalid or expired
     */
    @Override
    public String validateToken(String token) {
        // Step 1: Validate token
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }
        
        // Step 2: Extract and return email
        return jwtService.extractEmail(token);
    }

    /**
     * Extracts user information from a valid JWT token.
     *
     * @param token the JWT token
     * @return AuthResponseDTO with user info
     * @throws AppException with 401 UNAUTHORIZED if token is invalid or expired
     * @throws AppException with 404 NOT_FOUND if user doesn't exist
     */
    @Override
    public AuthResponseDTO getUserInfoFromToken(String token) {
        // Step 1: Validate token
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // Step 2: Extract email from token
        String email = jwtService.extractEmail(token);
        
        // Step 3: Find user by email
        User user = userService.findUserByEmail(email)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Step 4: Return user info
        return new AuthResponseDTO(
            token,
            user.getEmail(),
            user.getRole(),
            user.getFirstName(),
            user.getLastName(),
            "Token is valid"
        );
    }
}