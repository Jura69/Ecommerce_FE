export interface ApiResponse<T = any> {
  message: string;
  status: number;
  metadata: T;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

