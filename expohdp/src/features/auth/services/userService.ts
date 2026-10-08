// src/features/auth/services/userService.ts
import apiClient from '@shared/api/client';
import type {
  UpdateUserRequest,
  UserApiResponse,
  UserListApiResponse,
  UserResponse,
} from '../types/userTypes';


export const userService = {
  /**
   * Actualiza un usuario existente.
   * PUT /users/{id}
   */
  update: async (id: string, payload: UpdateUserRequest): Promise<UserResponse> => {
    const response = await apiClient.put<UserApiResponse>(
      `/v1/users/${id}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Elimina un usuario.
   * DELETE /users/{id} → 204 No Content
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/users/${id}`);
  },

  /**
   * Obtiene un usuario por ID.
   * GET /users/{id}
   */
  getById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserApiResponse>(
      `/v1/users/${id}`
    );
    return response.data.data;
  },

  /**
   * GET /api/v1/users → solo admin
   */
  getAll: async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserListApiResponse>(
      `/v1/users`
    );
    return response.data.data;
  },
};