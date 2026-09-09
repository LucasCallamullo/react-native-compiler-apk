// ============================================
// AUTH SERVICE
// ============================================

import apiClient, { API_BASE_URL } from '@shared/api/client';
import axios from 'axios';

import { ApiResponse } from '@shared/types/commonTypes';
import {
  LoginRequest,
  LoginResponse,
  LoginApiResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RefreshTokenApiResponse,
  UserInfo,
  UserInfoApiResponse,
} from '../types/authTypes';

// ============================================
// CONFIGURATION
// ============================================

const USE_MOCK = true;

// ============================================
// MOCK DATA
// ============================================

const MOCK_USER: UserInfo = {
  id: 1,
  email: 'test@mail.com',
  role: 'USER',
  firstName: 'Test',
  lastName: 'User',
};

const MOCK_AUTH_RESPONSE: LoginResponse = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJVc2VyIiwicm9sZSI6IlVTRVIiLCJ0eXBlIjoiYWNjZXNzIiwidXNlcklkIjoxLCJlbWFpbCI6InRlc3RAbWFpbC5jb20iLCJpc3N1ZXIiOiJtcy1jb3JlIiwic3ViIjoidGVzdEBtYWlsLmNvbSIsImlhdCI6MTc4NzY3OTAxOSwiZXhwIjoxNzg3NzY1NDE5fQ.sgYtmAbUE2uxNalv9v0zjoiu_gXNUwP8v5aDX_a1taU',
  refreshToken: 'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsImVtYWlsIjoidGVzdEBtYWlsLmNvbSIsImlzc3VlciI6Im1zLWNvcmUiLCJzdWIiOiJ0ZXN0QG1haWwuY29tIiwiaWF0IjoxNzg3Njc5MDE5LCJleHAiOjE3ODgyODM4MTl9.p-eMT9C-2jBKzVWCrNUu7E2oOkSxq-ZxNWeb2KnjmUQ',
  tokenType: 'Bearer',
  expiresIn: 86400000,
  user: MOCK_USER,
  message: 'Login successful',
};

// ============================================
// AUTH SERVICE
// ============================================

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
   * @param email - The user's email address.
   * @param password - The user's account password.
   * @returns Resolves to `LoginResponse` payload containing `accessToken`, `refreshToken`, and user attributes.
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (USE_MOCK) return MOCK_AUTH_RESPONSE;

    const request: LoginRequest = { email, password };
    const response = await apiClient.post<LoginApiResponse>('/v1/auth/login', request);
    // Returns `response.data.data` because the Spring Boot backend wraps responses inside an `ApiResponse` object.
    return response.data.data;
  },

  /**
   * Registers a new user account.
   *
   * @param userData - Registration payload matching register request DTO.
   * @param userData.firstName - User's first name.
   * @param userData.lastName - User's last name.
   * @param userData.email - User's email address.
   * @param userData.password - User's password.
   * @param userData.dni - User's identification number.
   * @param userData.phone - User's phone number.
   * @returns Resolves to `LoginResponse` payload with authentication tokens and created user info.
   */
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dni: string;
    phone: string;
  }): Promise<LoginResponse> => {
    if (USE_MOCK) return MOCK_AUTH_RESPONSE;

    const response = await apiClient.post<LoginApiResponse>('/v1/auth/register', userData);
    // Unwraps the `ApiResponse` payload (`response.data.data`).
    return response.data.data;
  },

  /**
   * Invalidates the current user session on the server.
   *
   * @returns Resolves to the server confirmation message or status payload.
   */
  logout: async (): Promise<{ message: string }> => {
    if (USE_MOCK) return { message: 'Logout successful' };

    const response = await apiClient.post<ApiResponse<{ message: string }>>('/v1/auth/logout');
    return response.data.data;
  },

  /**
   * Obtains a new Access Token using an active Refresh Token.
   * Direct `axios` is used instead of `apiClient` to avoid triggering response interceptor loops on 401 errors.
   *
   * @param refreshToken - The active refresh token stored in SecureStore.
   * @returns Resolves to `RefreshTokenResponse` containing the newly issued `accessToken`.
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    if (USE_MOCK) {
      return {
        accessToken: MOCK_AUTH_RESPONSE.accessToken,
        refreshToken: MOCK_AUTH_RESPONSE.refreshToken,
        tokenType: MOCK_AUTH_RESPONSE.tokenType,
        expiresIn: MOCK_AUTH_RESPONSE.expiresIn,
        user: MOCK_USER,
        message: 'Token refreshed successfully',
      };
    }

    const request: RefreshTokenRequest = { refreshToken };
    const response = await axios.post<RefreshTokenApiResponse>(
      `${API_BASE_URL}/v1/auth/refresh`,
      request
    );
    // Unwraps the newly issued token payload from `ApiResponse`.
    return response.data.data;
  },

  /**
   * Validates the active JWT token against the backend to verify session validity.
   *
   * @returns Resolves to user details extracted from the validated token.
   */
  validateToken: async (): Promise<UserInfo> => {
    if (USE_MOCK) return MOCK_USER;

    const response = await apiClient.get<UserInfoApiResponse>('/v1/auth/validate');
    return response.data.data;
  },
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default authService;