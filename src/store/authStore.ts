import { create } from 'zustand';
import { authService, type LoginCredentials, type SignupData } from '../services/api';
import { ApiResponse, AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  signup: (userData: SignupData) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response?.metadata?.shop || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (userData: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(userData);
      set({
        user: response?.metadata?.shop || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return response;
    } catch (error: any) {
      const errorMessage = error?.message || 'Signup failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Logout failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

