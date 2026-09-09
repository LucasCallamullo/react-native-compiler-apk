import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { RefreshTokenRequest, RefreshTokenApiResponse } from '@features/auth/types/authTypes';


// ============================================
// TYPES
// ============================================

/**
 * Base URL for the Spring Boot backend API.
 * Update this IP address based on your local development environment:
 * - Physical device: Local network IP (e.g., http://192.168.1.50:8080/api)
 * - Android Emulator: http://10.0.2.2:8080/api
 * - iOS Simulator: http://localhost:8080/api
 */
export const API_BASE_URL = 'http://192.168.100.124:8080/api';


/**
 * Extended request config with retry flag
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ============================================
// AXIOS INSTANCE
// ============================================

/**
 * Custom Axios instance pre-configured for global API communication.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

/**
 * Request Interceptor
 * Automatically injects the stored JWT Access Token from Expo SecureStore
 * into the Authorization header (`Bearer <token>`) for all outgoing requests.
 */
apiClient.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig): Promise<ExtendedAxiosRequestConfig> => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } catch (error) {
      console.warn('[API] Failed to retrieve access token:', error);
      return config;
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

/**
 * Response Interceptor
 * Handles global HTTP response errors and implements silent token refreshing.
 *
 * Key Architecture Decisions:
 * 1. Automatic 401 Interception: Captures unauthorized responses when an Access Token expires.
 * 2. Infinite Loop Prevention: Uses a custom flag (`_retry = true`) to ensure a retried request only runs once.
 * 3. Direct Axios Instance: Executes the refresh request using `axios.post` instead of `apiClient`
 *    to bypass this interceptor and avoid cyclic token refresh loops.
 * 4. Response Unwrapping: Accesses `response.data.data` because the backend wraps responses inside an `ApiResponse` container.
 * 5. Session Cleanup: Deletes persisted session keys from `SecureStore` if token renewal fails (e.g., expired refresh token).
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Guard: Ensure originalRequest exists and we can handle it
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check if error is 401 Unauthorized and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) {
          console.warn('[API] No refresh token available');
          throw new Error('No refresh token available');
        }

        console.info('[API] Attempting token refresh...');

        // Direct axios instance to avoid recursive interceptor calls
        const response = await axios.post<RefreshTokenApiResponse>(
          `${API_BASE_URL}/v1/auth/refresh`,
          { refreshToken } as RefreshTokenRequest
        );

        // Unwraps the new access token payload from the `ApiResponse` object (`response.data.data`)
        const newAccessToken = response.data.data.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token in refresh response');
        }

        // Persist new token
        await SecureStore.setItemAsync('access_token', newAccessToken);
        console.info('[API] Token refreshed successfully');

        // Retry the original failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError);

        // Clear stored session state when token restoration fails
        try {
          await SecureStore.deleteItemAsync('access_token');
          await SecureStore.deleteItemAsync('refresh_token');
          await SecureStore.deleteItemAsync('user_info');
          console.info('[API] Session cleared due to refresh failure');
        } catch (clearError) {
          console.error('[API] Failed to clear session:', clearError);
        }

        return Promise.reject(refreshError);
      }
    }

    // Log non-401 errors for debugging
    if (error.response?.status) {
      console.warn(`[API] HTTP ${error.response.status} error:`, {
        url: originalRequest?.url,
        method: originalRequest?.method,
        status: error.response.status,
      });
    }

    return Promise.reject(error);
  }
);

// ============================================
// EXPORTS
// ============================================

export default apiClient;

// Convenience export for direct use
export { apiClient };