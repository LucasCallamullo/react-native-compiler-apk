// ============================================
// AUTH CONTEXT
// ============================================

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { UserInfo, LoginResponse } from '../types/authTypes';
import { RegisterDTO } from '../types/authTypes';

// ============================================
// TYPES
// ============================================

/**
 * Auth Context Type
 */
interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (registerDTO: RegisterDTO) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateUser: (user: UserInfo) => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages global authentication state, token persistence in `SecureStore`,
 * and exposes authentication methods (login, register, logout) to the app.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On initial mount, attempt to restore persistent session from SecureStore
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Restores session state from encrypted local storage on app initialization.
   * Validates presence of access token and user information.
   */
  const checkAuthStatus = async (): Promise<void> => {
    try {
      const accessToken = await SecureStore.getItemAsync('access_token');
      const storedUser = await SecureStore.getItemAsync('user_info');

      if (accessToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as UserInfo;
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing stored user info:', parseError);
          await SecureStore.deleteItemAsync('user_info');
        }
      }
    } catch (error) {
      console.error('Error restoring stored session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticates user with credentials, stores JWT tokens securely,
   * extracts user profile info, and updates the application context state.
   *
   * @param email - User email address.
   * @param password - User account password.
   * @returns Full authentication payload returned from authService.
   */
  const login = async (email: string, password: string): Promise<LoginResponse> => {
    const authData = await authService.login(email, password);

    // Separate JWT metadata from user details to store clean user information
    const { accessToken, refreshToken, tokenType, expiresIn, message, user: userPayload } = authData;

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
   * @param registerDTO - Registration payload matching backend DTO requirements.
   * @returns Full authentication payload returned upon creation.
   */
  const register = async (registerDTO: RegisterDTO): Promise<LoginResponse> => {
    const authData = await authService.register(registerDTO);

    // Destructure response metadata and preserve user domain fields
    const { accessToken, refreshToken, tokenType, expiresIn, message, user: userPayload } = authData;

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
  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Server logout failed or token expired, clearing local session fallback.');
    } finally {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('user_info');
      setUser(null);
    }
  };

  /**
   * Updates the current user state (e.g., after profile update)
   */
  const updateUser = (updatedUser: UserInfo): void => {
    setUser(updatedUser);
    // Optionally update stored user info
    SecureStore.setItemAsync('user_info', JSON.stringify(updatedUser)).catch((error) => {
      console.error('Failed to update stored user info:', error);
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// HOOK
// ============================================

/**
 * Custom hook to consume the AuthContext state and methods.
 * @returns Auth context with user, authentication status, and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};