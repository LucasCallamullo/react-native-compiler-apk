package com.vg.auth.service.impl;

import com.vg.auth.dto.request.LoginRequestDTO;
import com.vg.auth.dto.request.RefreshTokenRequestDTO;
import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.response.AuthResponseDTO;
import com.vg.auth.dto.response.RefreshTokenResponseDTO;
import com.vg.auth.mapper.UserMapper;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

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

        // Step 4: Generate access token and refresh token
        String accessToken = jwtService.generateAccessToken(user.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        // Step 5: Return authentication response with both tokens
        var userDto = userMapper.toResponseDTO(user);

        // Step 7: Return authentication response
        return new AuthResponseDTO(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpiration(),
            "Login successful", 
            userDto
        );
    }

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
            .password(passwordEncoder.encode(registerRequest.password()))
            .dni(registerRequest.dni())
            .phone(registerRequest.phone())
            .role(UserRole.USER)
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

        // Step 6: Generate access token and refresh token
        String accessToken = jwtService.generateAccessToken(savedUser.getEmail(), claims);
        String refreshToken = jwtService.generateRefreshToken(savedUser.getEmail());

        var userDto = userMapper.toResponseDTO(savedUser);

        // Step 7: Return authentication response
        return new AuthResponseDTO(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpiration(),
            "Registration successful", 
            userDto
        );
    }

    @Override
    public boolean logout(String token) {
        // In a stateless JWT system, logout is handled client-side.
        return true;
    }

    @Override
    public RefreshTokenResponseDTO refreshToken(RefreshTokenRequestDTO refreshRequest) {
        String token = refreshRequest.token();
        
        // Step 1: Validate the token
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        // Step 2: Verify this is a refresh token
        String tokenType = jwtService.extractTokenType(token);
        if (!"refresh".equals(tokenType)) {
            throw new AppException("Invalid token type. Expected refresh token.", HttpStatus.UNAUTHORIZED);
        }

        // Step 3: Extract email from token
        String email = jwtService.extractEmail(token);
        
        // Step 4: Find user by email
        User user = userService.findUserByEmail(email)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        // Step 5: Build claims for new tokens
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        // Step 6: Generate new access token and refresh token
        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), claims);
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());

        // Step 7: Return response with new tokens
        return new RefreshTokenResponseDTO(
            newAccessToken,
            newRefreshToken,
            jwtService.getAccessTokenExpiration(),
            "Token refreshed successfully"
        );
    }

    @Override
    public String validateToken(String token) {
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }
        return jwtService.extractEmail(token);
    }

    @Override
    public AuthResponseDTO getUserInfoFromToken(String token) {
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        String email = jwtService.extractEmail(token);
        
        User user = userService.findUserByEmail(email)
            .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        var userDto = userMapper.toResponseDTO(user);

        // Step 7: Return authentication response
        return new AuthResponseDTO(
            token,
            null, // No refresh token for validation endpoint
            jwtService.getAccessTokenExpiration(),
            "Token is valid", 
            userDto
        );
    }
}