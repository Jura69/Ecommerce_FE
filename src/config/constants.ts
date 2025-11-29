export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3056/v1/api',
  API_KEY: import.meta.env.VITE_API_KEY || 'api-key-dev-2025',
  TIMEOUT: 30000,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  CLIENT_ID: 'clientId',
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/shop/login',
  SIGNUP: '/shop/signup',
  LOGOUT: '/shop/logout',
  REFRESH_TOKEN: '/shop/handlerRefreshToken',
} as const;

export const API_ROUTES = {
  PRODUCTS: '/product',
  CART: '/cart',
  DISCOUNT: '/discount',
  CHECKOUT: '/checkout',
  INVENTORY: '/inventory',
} as const;

