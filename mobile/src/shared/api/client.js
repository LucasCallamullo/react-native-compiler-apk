// src/shared/api/client.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * Base URL for the Spring Boot backend API.
 * Update this IP address based on your local development environment:
 * - Physical device: Local network IP (e.g., http://192.168.1.50:8080/api)
 * - Android Emulator: http://10.0.2.2:8080/api
 * - iOS Simulator: http://localhost:8080/api
 */
export const API_BASE_URL = 'http://192.168.100.124:8080/api';

/**
 * Custom Axios instance pre-configured for global API communication.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically injects the stored JWT Access Token from Expo SecureStore
 * into the Authorization header (`Bearer <token>`) for all outgoing requests.
 */
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Direct axios instance to avoid recursive interceptor calls
        const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
          refreshToken,
        });

        // Unwraps the new access token payload from the `ApiResponse` object (`response.data.data`)
        const { accessToken: newAccessToken } = response.data.data;

        // Persist new token and retry the original failed request
        await SecureStore.setItemAsync('access_token', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear stored session state when token restoration fails
        await SecureStore.deleteItemAsync('access_token');
        await SecureStore.deleteItemAsync('refresh_token');
        await SecureStore.deleteItemAsync('user_info');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;