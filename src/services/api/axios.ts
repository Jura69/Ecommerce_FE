import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, STORAGE_KEYS, AUTH_ROUTES } from '../../config/constants';
import { ApiResponse, ApiError } from '../../types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.API_KEY,
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);

    if (accessToken && config.headers) {
      config.headers.authorization = accessToken;
    }

    if (clientId && config.headers) {
      config.headers['x-client-id'] = clientId;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): ApiResponse => {
    return response.data;
  },
  async (error: AxiosError<ApiResponse>): Promise<never> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);

        if (!refreshToken || !clientId) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>(
          `${API_CONFIG.BASE_URL}${AUTH_ROUTES.REFRESH_TOKEN}`,
          { refreshToken },
          {
            headers: {
              'x-api-key': API_CONFIG.API_KEY,
              'x-client-id': clientId,
            },
          }
        );

        const { tokens } = response.data?.metadata || {};
        if (!tokens) {
          throw new Error('Invalid refresh token response');
        }

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.authorization = tokens.accessToken;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CLIENT_ID);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const errorMessage: ApiError = {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(errorMessage);
  }
);

export default axiosInstance;

