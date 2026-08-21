package com.vg.auth.service;

import com.vg.auth.dto.request.LoginRequestDTO;
import com.vg.auth.dto.request.RefreshTokenRequestDTO;
import com.vg.auth.dto.request.RegisterRequestDTO;
import com.vg.auth.dto.response.AuthResponseDTO;
import com.vg.auth.dto.response.RefreshTokenResponseDTO;
import com.vg.shared.exception.AppException;

public interface AuthService {

    /**
     * Registers a new user (public registration).
     *
     * @param registerRequest the registration data
     * @return AuthResponseDTO containing JWT token and user info
     * @throws AppException if email or DNI already exists (HTTP 409 Conflict)
     */
    AuthResponseDTO register(RegisterRequestDTO registerRequest);

    /**
     * Authenticates a user with email and password.
     *
     * @param loginRequest the login credentials
     * @return AuthResponseDTO containing JWT token and user info
     * @throws AppException if credentials are invalid (HTTP 401 Unauthorized)
     */
    AuthResponseDTO login(LoginRequestDTO loginRequest);

    /**
     * Logs out a user by invalidating the current token.
     * In a stateless JWT system, this is typically handled client-side.
     * However, we can implement token blacklisting if needed.
     *
     * @param token the JWT token to invalidate
     * @return true if logout was successful
     */
    boolean logout(String token);

    /**
     * Refreshes an expired JWT token.
     *
     * @param refreshRequest containing the expired/current token
     * @return RefreshTokenResponseDTO with a new JWT token
     * @throws AppException if token is invalid (HTTP 401 Unauthorized)
     */
    RefreshTokenResponseDTO refreshToken(RefreshTokenRequestDTO refreshRequest);

    /**
     * Validates a JWT token and returns the associated user email.
     *
     * @param token the JWT token to validate
     * @return the email extracted from the token
     * @throws AppException if token is invalid or expired (HTTP 401 Unauthorized)
     */
    String validateToken(String token);

    /**
     * Extracts user information from a valid JWT token.
     *
     * @param token the JWT token
     * @return AuthResponseDTO with user info (without generating new token)
     * @throws AppException if token is invalid or expired (HTTP 401 Unauthorized)
     */
    AuthResponseDTO getUserInfoFromToken(String token);
}
