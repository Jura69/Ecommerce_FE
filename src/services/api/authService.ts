import axiosInstance from './axios';
import { AUTH_ROUTES, STORAGE_KEYS } from '../../config/constants';
import { ApiResponse, AuthResponse, User } from '../../types';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async signup(userData: SignupData): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      AUTH_ROUTES.SIGNUP,
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }
    );

    if (response.metadata) {
      const { shop, tokens } = response.metadata;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.CLIENT_ID, shop._id);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(shop));
    }

    return response;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      AUTH_ROUTES.LOGIN,
      {
        email: credentials.email,
        password: credentials.password,
      }
    );

    if (response.metadata) {
      const { shop, tokens } = response.metadata;

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.CLIENT_ID, shop._id);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(shop));
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(AUTH_ROUTES.LOGOUT);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CLIENT_ID);
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
}

export const authService = new AuthService();
export default authService;

