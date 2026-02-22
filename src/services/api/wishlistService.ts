import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface WishlistItem {
    _id: string;
    wishlist_productId: {
        _id: string;
        product_name: string;
        product_thumb: string;
        product_price: number;
        product_ratingAvr?: number;
    };
    createdAt: string;
}

export interface WishlistResponse {
    items: WishlistItem[];
    total: number;
    page: number;
    totalPages: number;
}

class WishlistService {
    async getWishlist(params?: { page?: number; limit?: number }): Promise<ApiResponse<WishlistResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));
        const query = queryParams.toString();
        const response = await axiosInstance.get(`/wishlist${query ? `?${query}` : ''}`);
        return response as unknown as ApiResponse<WishlistResponse>;
    }

    async getWishlistIds(): Promise<ApiResponse<string[]>> {
        const response = await axiosInstance.get('/wishlist/ids');
        return response as unknown as ApiResponse<string[]>;
    }

    async addToWishlist(productId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.post('/wishlist', { productId });
        return response as unknown as ApiResponse<any>;
    }

    async removeFromWishlist(productId: string): Promise<ApiResponse<any>> {
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        return response as unknown as ApiResponse<any>;
    }
}

export const wishlistService = new WishlistService();
export default wishlistService;
