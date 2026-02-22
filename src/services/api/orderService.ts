import axiosInstance from './axios';
import { ApiResponse, Order } from '../../types';

export interface GetOrdersParams {
    page?: number;
    limit?: number;
    status?: string;
}

export interface CancelOrderData {
    reason?: string;
}

export interface UpdateOrderStatusData {
    status: string;
    reason?: string;
}

class OrderService {
    async getOrders(params?: GetOrdersParams): Promise<ApiResponse<Order[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        if (params?.status) queryParams.append('status', params.status);

        const query = queryParams.toString();
        const url = `/order${query ? `?${query}` : ''}`;
        const response = await axiosInstance.get(url);
        return response as unknown as ApiResponse<Order[]>;
    }

    async getOrderDetail(orderId: string): Promise<ApiResponse<Order>> {
        const response = await axiosInstance.get(`/order/${orderId}`);
        return response as unknown as ApiResponse<Order>;
    }

    async cancelOrder(
        orderId: string,
        data?: CancelOrderData
    ): Promise<ApiResponse<Order>> {
        const response = await axiosInstance.patch(
            `/order/${orderId}/cancel`,
            data || {}
        );
        return response as unknown as ApiResponse<Order>;
    }

    async updateOrderStatus(
        orderId: string,
        data: UpdateOrderStatusData
    ): Promise<ApiResponse<Order>> {
        const response = await axiosInstance.patch(
            `/order/${orderId}/status`,
            data
        );
        return response as unknown as ApiResponse<Order>;
    }
}

export const orderService = new OrderService();
export default orderService;
