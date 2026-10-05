package com.vg.auth.service.impl;

import com.vg.auth.dto.request.LoginRequestDTO;
import com.vg.auth.dto.request.RefreshTokenRequestDTO;
import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.response.AuthResponseDTO;
import com.vg.auth.dto.response.RefreshTokenResponseDTO;
import com.vg.auth.mapper.UserMapper;

import com.vg.auth.model.Rol;
import com.vg.auth.model.User;

import com.vg.auth.service.AuthService;
import com.vg.auth.service.JwtService;
import com.vg.auth.service.RolService;
import com.vg.auth.service.UserService;
import com.vg.shared.exception.AppException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final RolService rolService;

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // Step 1: Find user by email with roles eagerly loaded
        User user = userService.findUserByEmailWithRoles(loginRequest.email())
            .orElseThrow(() -> new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        // Step 2: Validate password using BCrypt
        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        // Step 3: Build claims for JWT
        var claims = buildUserClaims(user);

        // Step 4: Generate access token and refresh token
        String accessToken = jwtService.generateAccessToken(user.getId(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        // Step 5: Return authentication response with both tokens & user response dto
        return new AuthResponseDTO(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpiration(),
            "Login successful", 
            userMapper.toResponseDTO(user)        // Return user response dto
        );
    }


    @Override
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        // Step 1: Validate email is unique
        userService.validateEmailUnique(request.email());

        // Step 2: Validate DNI is unique
        userService.validateDniUnique(request.dni());

        // Step 3: Map DTO to User entity
        User user = userMapper.registerToEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));

        // Step 4: Assign default USER role (returns the Rol, no modifica el user)
        List<Rol> roles = rolService.assignDefaultRole(user);

        // Step 5: Save user & generate uuid
        User savedUser = userService.save(user);

        // Step 6: Save UserRoles manually
        // List<UserRoles> userRoles = rolService.saveRoles(savedUser, roles);
        rolService.saveRoles(savedUser, roles);

        // Step 7: Build claims for JWT
        var claims = buildUserClaims(savedUser);

        // Step 8: Generate access token and refresh token
        String accessToken = jwtService.generateAccessToken(savedUser.getId(), claims);
        String refreshToken = jwtService.generateRefreshToken(savedUser.getId());

        // Step 9: Return authentication response
        return new AuthResponseDTO(
            accessToken,
            refreshToken,
            jwtService.getAccessTokenExpiration(),
            "Registration successful", 
            userMapper.toResponseDTO(savedUser)    // get AuthResponseDTO
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
        UUID userId = jwtService.extractUserId(token);
        
        // Step 4: Find user by email
        User user = userService.findUserByIdWithRoles(userId);

        // Step 5: Build claims for JWT
        var claims = buildUserClaims(user);

        // Step 6: Generate new access token and refresh token
        String newAccessToken = jwtService.generateAccessToken(user.getId(), claims);
        String newRefreshToken = jwtService.generateRefreshToken(user.getId());

        // Step 7: Return response with new tokens
        return new RefreshTokenResponseDTO(
            newAccessToken,
            newRefreshToken,
            jwtService.getAccessTokenExpiration(),
            "Token refreshed successfully"
        );
    }

    
    // ---------------------- PRIVATE HELPER TO GET CLAIMS FOR JWT
    
    private Map<String, Object> buildUserClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles().stream()
            .map(ur -> ur.getRole().getName())
            .toList());
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());
        return claims;
    }

    @Override
    public AuthResponseDTO getUserInfoFromToken(String token) {
        // stupid method to get me/
        if (!jwtService.isTokenValid(token)) {
            throw new AppException("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }

        UUID userId = jwtService.extractUserId(token);
        
        User user = userService.findUserByIdWithRoles(userId);

        // Step 7: Return authentication response
        return new AuthResponseDTO(
            token,
            null, // No refresh token for validation endpoint
            jwtService.getAccessTokenExpiration(),
            "Token is valid", 
            userMapper.toResponseDTO(user)
        );
    }
}