import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface SystemStats {
    totalShops: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export interface ShopListItem {
    _id: string;
    name: string;
    email: string;
    status: string;
    verify: boolean;
    roles: string[];
    createdAt: string;
}

class AdminService {
    async getSystemStats(): Promise<ApiResponse<SystemStats>> {
        return axiosInstance.get('/admin/stats') as any;
    }

    async getShops(params?: { page?: number; limit?: number; status?: string }): Promise<any> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', String(params.page));
        if (params?.limit) query.append('limit', String(params.limit));
        if (params?.status) query.append('status', params.status);
        return axiosInstance.get(`/admin/shops?${query}`) as any;
    }

    async updateShopStatus(shopId: string, status: string): Promise<any> {
        return axiosInstance.patch(`/admin/shops/${shopId}/status`, { status }) as any;
    }

    async getAllOrders(params?: { page?: number; limit?: number; status?: string }): Promise<any> {
        const query = new URLSearchParams();
        if (params?.page) query.append('page', String(params.page));
        if (params?.limit) query.append('limit', String(params.limit));
        if (params?.status) query.append('status', params.status);
        return axiosInstance.get(`/admin/orders?${query}`) as any;
    }
}

export const adminService = new AdminService();
export default adminService;
