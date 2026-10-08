import { ApiResponse } from '@shared/types/commonTypes';
import { UserResponse } from '@features/auth/types/userTypes';

// AUTH 

/**
 * Register DTO - matches backend RegisterRequestDTO
 */
export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dni: string;
  phone: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response data
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
  message: string;
}

/**
 * Refresh token request payload
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response data
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
  message: string;
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

/**
 * Wrapped Login Response
 */
export type LoginApiResponse = ApiResponse<LoginResponse>;

/**
 * Wrapped Refresh Token Response
 */
export type RefreshTokenApiResponse = ApiResponse<RefreshTokenResponse>;

/**
 * Wrapped User Info Response
 */
export type UserInfoApiResponse = ApiResponse<UserResponse>;