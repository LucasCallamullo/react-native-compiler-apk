// src/features/auth/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';

const AuthContext = createContext({});

/**
 * Authentication Provider Component
 * Manages global authentication state, token persistence in `SecureStore`,
 * and exposes authentication methods (login, register, logout) to the app.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial mount, attempt to restore persistent session from SecureStore
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Restores session state from encrypted local storage on app initialization.
   * Validates presence of access token and user information.
   */
  const checkAuthStatus = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      const storedUser = await SecureStore.getItemAsync('user_info');

      if (accessToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error restoring stored session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticates user with credentials, stores JWT tokens securely,
   * extracts user profile info, and updates the application context state.
   *
   * @param {string} email - User email address.
   * @param {string} password - User account password.
   * @returns {Promise<Object>} Full authentication payload returned from authService.
   */
  const login = async (email, password) => {
    const authData = await authService.login(email, password);
    
    // Separate JWT metadata from user details to store clean user information
    const { accessToken, refreshToken, tokenType, expiresIn, message, ...userPayload } = authData;

    await SecureStore.setItemAsync('access_token', accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync('refresh_token', refreshToken);
    }
    await SecureStore.setItemAsync('user_info', JSON.stringify(userPayload));

    setUser(userPayload);
    return authData;
  };

  /**
   * Registers a new user, automatically stores returned JWT tokens,
   * updates application context, and sets session state to authenticated.
   *
   * @param {Object} registerDTO - Registration payload matching backend DTO requirements.
   * @returns {Promise<Object>} Full authentication payload returned upon creation.
   */
  const register = async (registerDTO) => {
    const authData = await authService.register(registerDTO);
    
    // Destructure response metadata and preserve user domain fields
    const { accessToken, refreshToken, tokenType, expiresIn, message, ...userPayload } = authData;

    await SecureStore.setItemAsync('access_token', accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync('refresh_token', refreshToken);
    }
    await SecureStore.setItemAsync('user_info', JSON.stringify(userPayload));

    setUser(userPayload);
    return authData;
  };

  /**
   * Clears session on the remote server (if active), destroys locally persisted tokens
   * in `SecureStore`, and resets user state to unauthenticated.
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Server logout failed or token expired, clearing local session fallback.');
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_info');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext state and methods.
 * @returns {{ user: Object|null, isAuthenticated: boolean, isLoading: boolean, login: Function, register: Function, logout: Function }}
 */
export const useAuth = () => useContext(AuthContext);