// src/features/auth/types/userTypes.ts

import { ApiResponse } from '@shared/types/commonTypes';

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone?: string;   // opcional en el DTO del back
  // password NO va acá — flujo separado
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone?: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Por si más adelante querés el flujo de password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

/**
 * Wrapped Login Response
 */
export type UserApiResponse = ApiResponse<UserResponse>;
export type UserListApiResponse = ApiResponse<UserResponse[]>;
