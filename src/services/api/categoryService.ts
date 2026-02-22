import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface CategoryData {
    _id: string;
    category_name: string;
    category_slug: string;
    category_description?: string;
    category_icon?: string;
    category_parent?: string | null;
    category_level: number;
    category_order: number;
    category_isActive: boolean;
    category_productCount?: number;
    category_attributeSchema?: Array<{
        name: string;
        type: string;
        required?: boolean;
        options?: string[];
    }>;
    children?: CategoryData[];
}

export interface AdvancedProductsResponse {
    products: any[];
    total: number;
    page: number;
    totalPages: number;
}

export interface AdvancedProductsParams {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

class CategoryService {
    async getCategories(): Promise<ApiResponse<CategoryData[]>> {
        const response = await axiosInstance.get('/category');
        return response as unknown as ApiResponse<CategoryData[]>;
    }

    async getCategoryTree(): Promise<ApiResponse<CategoryData[]>> {
        const response = await axiosInstance.get('/category/tree');
        return response as unknown as ApiResponse<CategoryData[]>;
    }

    async getProductsAdvanced(params: AdvancedProductsParams): Promise<ApiResponse<AdvancedProductsResponse>> {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.priceMin !== undefined) queryParams.append('priceMin', String(params.priceMin));
        if (params.priceMax !== undefined) queryParams.append('priceMax', String(params.priceMax));
        if (params.rating) queryParams.append('rating', String(params.rating));
        if (params.search) queryParams.append('search', params.search);
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.page) queryParams.append('page', String(params.page));
        if (params.limit) queryParams.append('limit', String(params.limit));

        const query = queryParams.toString();
        const url = `/product/advanced${query ? `?${query}` : ''}`;
        const response = await axiosInstance.get(url);
        return response as unknown as ApiResponse<AdvancedProductsResponse>;
    }
}

export const categoryService = new CategoryService();
export default categoryService;
