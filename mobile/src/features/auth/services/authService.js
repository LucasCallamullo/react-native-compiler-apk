// src/features/auth/services/authService.js
import apiClient, { API_BASE_URL } from '@shared/api/client';
import axios from 'axios';

const USE_MOCK = true;

const MOCK_AUTH_RESPONSE = {
  accessToken: "eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwidXNlcklkIjoxLCJlbWFpbCI6InRlc3RAbWFpbC5jb20iLCJpc3N1ZXIiOiJtcy1jb3JlIiwic3ViIjoidGVzdEBtYWlsLmNvbSIsImlhdCI6MTc4NzY3OTAxOSwiZXhwIjoxNzg3NzY1NDE5fQ.sgYtmAbUE2uxNalv9v0zjoiu_gXNUwP8v5aDX_a1taU",
  refreshToken: "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsImVtYWlsIjoidGVzdEBtYWlsLmNvbSIsImlzc3VlciI6Im1zLWNvcmUiLCJzdWIiOiJ0ZXN0QG1haWwuY29tIiwiaWF0IjoxNzg3Njc5MDE5LCJleHAiOjE3ODgyODM4MTl9.p-eMT9C-2jBKzVWCrNUu7E2oOkSxq-ZxNWeb2KnjmUQ",
  tokenType: "Bearer",
  expiresIn: 86400000,
  email: "test@mail.com",
  role: "USER",
  firstName: "Test",
  lastName: "User",
  phone: "12345678",
  dni: "12345678",
  message: "Login successful"
};

/**
 * Authentication Service
 * Handles all HTTP requests related to user authentication and token management.
 * 
 * Note: Spring Boot wraps all JSON responses in a standard `ApiResponse<T>` structure.
 * Therefore, Axios extracts `response.data`, and accessing `.data` again (`response.data.data`)
 * unwraps the inner payload containing tokens and user details.
 */
export const authService = {
  /**
   * Authenticates user credentials with the backend.
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's account password.
   * @returns {Promise<Object>} Resolves to `AuthResponseDTO` payload containing `accessToken`, `refreshToken`, and user attributes.
   */
  login: async (email, password) => {
    if (USE_MOCK) return MOCK_AUTH_RESPONSE;

    const response = await apiClient.post('/v1/auth/login', { email, password });
    // Returns `response.data.data` because the Spring Boot backend wraps responses inside an `ApiResponse` object.
    return response.data.data;
  },

  /**
   * Registers a new user account.
   *
   * @param {Object} userData - Registration payload matching `RegisterRequestDTO`.
   * @param {string} userData.firstName - User's first name.
   * @param {string} userData.lastName - User's last name.
   * @param {string} userData.email - User's email address.
   * @param {string} userData.password - User's password.
   * @param {string} userData.dni - User's identification number.
   * @param {string} userData.phone - User's phone number.
   * @returns {Promise<Object>} Resolves to `AuthResponseDTO` payload with authentication tokens and created user info.
   */
  register: async (userData) => {
    if (USE_MOCK) return MOCK_AUTH_RESPONSE;

    const response = await apiClient.post('/v1/auth/register', userData);
    // Unwraps the `ApiResponse` payload (`response.data.data`).
    return response.data.data;
  },

  /**
   * Invalidates the current user session on the server.
   *
   * @returns {Promise<Object>} Resolves to the server confirmation message or status payload.
   */
  logout: async () => {
    if (USE_MOCK) return { message: "Logout successful" };
    
    const response = await apiClient.post('/v1/auth/logout');
    return response.data.data;
  },

  /**
   * Obtains a new Access Token using an active Refresh Token.
   * Direct `axios` is used instead of `apiClient` to avoid triggering response interceptor loops on 401 errors.
   *
   * @param {string} refreshToken - The active refresh token stored in SecureStore.
   * @returns {Promise<Object>} Resolves to `RefreshTokenResponseDTO` containing the newly issued `accessToken`.
   */
  refreshToken: async (refreshToken) => {
    if (USE_MOCK) return { accessToken: MOCK_AUTH_RESPONSE.accessToken };

    const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
      refreshToken,
    });
    // Unwraps the newly issued token payload from `ApiResponse`.
    return response.data.data;
  },

  /**
   * Validates the active JWT token against the backend to verify session validity.
   *
   * @returns {Promise<Object>} Resolves to user details extracted from the validated token.
   */
  validateToken: async () => {
    if (USE_MOCK) return MOCK_AUTH_RESPONSE;

    const response = await apiClient.get('/v1/auth/validate');
    return response.data.data;
  },
};