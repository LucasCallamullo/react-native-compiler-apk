package com.vg.auth.controller;

import com.vg.auth.dto.request.LoginRequestDTO;
import com.vg.auth.dto.request.RefreshTokenRequestDTO;
import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.response.AuthResponseDTO;
import com.vg.auth.dto.response.RefreshTokenResponseDTO;
import com.vg.auth.service.AuthService;
import com.vg.shared.exception.AppException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user (public registration).
     *
     * @param registerRequest the registration data
     * @return AuthResponseDTO with JWT token and user info
     * @throws AppException if email or DNI already exists (HTTP 409 Conflict)
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        AuthResponseDTO response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param loginRequest the login credentials
     * @return AuthResponseDTO with JWT token and user info
     * @throws AppException if credentials are invalid (HTTP 401 Unauthorized)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        AuthResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Logs out a user (client-side token discard).
     * In a stateless JWT system, this is typically handled client-side.
     *
     * @param token the JWT token to invalidate (optional)
     * @return success message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token != null && token.startsWith("Bearer ")) {
            authService.logout(token.substring(7));
        }
        return ResponseEntity.ok("Logout successful");
    }

    /**
     * Refreshes an expired JWT token.
     *
     * @param refreshRequest containing the expired/current token
     * @return RefreshTokenResponseDTO with a new JWT token
     * @throws AppException if token is invalid (HTTP 401 Unauthorized)
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO refreshRequest) {
        RefreshTokenResponseDTO response = authService.refreshToken(refreshRequest);
        return ResponseEntity.ok(response);
    }

    /**
     * Validates a JWT token and returns user info.
     *
     * @param token the JWT token
     * @return AuthResponseDTO with user info
     * @throws AppException if token is invalid (HTTP 401 Unauthorized)
     */
    @GetMapping("/validate")
    public ResponseEntity<AuthResponseDTO> validateToken(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        AuthResponseDTO response = authService.getUserInfoFromToken(token);
        return ResponseEntity.ok(response);
    }
}
