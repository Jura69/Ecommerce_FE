import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface ReviewData {
    _id: string;
    review_userId: { name: string; avatar?: string };
    review_productId: string;
    review_orderId: string;
    review_rating: number;
    review_title: string;
    review_content: string;
    review_images: string[];
    review_isVerified: boolean;
    createdAt: string;
}

export interface ReviewStatsData {
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
}

export interface ReviewsResponse {
    reviews: ReviewData[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CreateReviewData {
    productId: string;
    orderId: string;
    rating: number;
    title?: string;
    content?: string;
    images?: string[];
}

class ReviewService {
    async getProductReviews(
        productId: string,
        params?: { sort?: string; page?: number; limit?: number }
    ): Promise<ApiResponse<ReviewsResponse>> {
        const queryParams = new URLSearchParams();
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.page) queryParams.append('page', String(params.page));
        if (params?.limit) queryParams.append('limit', String(params.limit));

        const query = queryParams.toString();
        const url = `/review/product/${productId}${query ? `?${query}` : ''}`;
        const response = await axiosInstance.get(url);
        return response as unknown as ApiResponse<ReviewsResponse>;
    }

    async getReviewStats(productId: string): Promise<ApiResponse<ReviewStatsData>> {
        const response = await axiosInstance.get(`/review/product/${productId}/stats`);
        return response as unknown as ApiResponse<ReviewStatsData>;
    }

    async createReview(data: CreateReviewData): Promise<ApiResponse<ReviewData>> {
        const response = await axiosInstance.post('/review', data);
        return response as unknown as ApiResponse<ReviewData>;
    }

    async deleteReview(reviewId: string): Promise<ApiResponse<{ deleted: boolean }>> {
        const response = await axiosInstance.delete(`/review/${reviewId}`);
        return response as unknown as ApiResponse<{ deleted: boolean }>;
    }
}

export const reviewService = new ReviewService();
export default reviewService;
