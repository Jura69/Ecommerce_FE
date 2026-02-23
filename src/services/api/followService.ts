import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface FollowedShop {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    description?: string;
}

export const followService = {
    followShop: async (shopId: string): Promise<ApiResponse<{ shopId: string; followed: boolean }>> => {
        const response = await axiosInstance.post(`/follow/${shopId}`);
        return response.data;
    },

    unfollowShop: async (shopId: string): Promise<ApiResponse<{ shopId: string; followed: boolean }>> => {
        const response = await axiosInstance.delete(`/follow/${shopId}`);
        return response.data;
    },

    checkFollow: async (shopId: string): Promise<ApiResponse<{ isFollowing: boolean }>> => {
        const response = await axiosInstance.get(`/follow/check/${shopId}`);
        return response.data;
    },

    getMyFollows: async (page = 1, limit = 20): Promise<ApiResponse<{ shops: FollowedShop[]; total: number; page: number; totalPages: number }>> => {
        const response = await axiosInstance.get('/follow/my', { params: { page, limit } });
        return response.data;
    },

    getFollowerCount: async (shopId: string): Promise<ApiResponse<{ count: number }>> => {
        const response = await axiosInstance.get(`/follow/count/${shopId}`);
        return response.data;
    },
};
