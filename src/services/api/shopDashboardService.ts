import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface ShopStats {
    productCount: number;
    orderCount: number;
    totalRevenue: number;
}

export interface ShopProfileData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    description?: string;
    status: string;
    verify?: boolean;
    productCount: number;
    createdAt: string;
}

export interface ShopProductsResponse {
    products: any[];
    total: number;
    page: number;
    totalPages: number;
}

export interface ShopOrdersResponse {
    orders: any[];
    total: number;
    page: number;
    totalPages: number;
}

class ShopDashboardService {
    async getStats(): Promise<ApiResponse<ShopStats>> {
        const response = await axiosInstance.get('/shop/stats');
        return response as unknown as ApiResponse<ShopStats>;
    }

    async getProfile(shopId: string): Promise<ApiResponse<ShopProfileData>> {
        const response = await axiosInstance.get(`/shop/profile/${shopId}`);
        return response as unknown as ApiResponse<ShopProfileData>;
    }

    async getMyProducts(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<ShopProductsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        const query = queryParams.toString();
        const response = await axiosInstance.get(`/shop/products${query ? `?${query}` : ''}`);
        return response as unknown as ApiResponse<ShopProductsResponse>;
    }

    async getMyOrders(params?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<ShopOrdersResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        const query = queryParams.toString();
        const response = await axiosInstance.get(`/shop/orders${query ? `?${query}` : ''}`);
        return response as unknown as ApiResponse<ShopOrdersResponse>;
    }

    async updateOrderStatus(orderId: string, status: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.patch(`/shop/orders/${orderId}/status`, { status });
        return response as unknown as ApiResponse<any>;
    }
}

export const shopDashboardService = new ShopDashboardService();
export default shopDashboardService;
