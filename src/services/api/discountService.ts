import axiosInstance from './axios';
import { ApiResponse, Discount, DiscountAmount } from '../../types';

export interface GetDiscountAmountData {
  codeId: string;
  userId: string;
  shopId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreateDiscountData {
  discount_name: string;
  discount_description?: string;
  discount_type: 'fixed_amount' | 'percentage';
  discount_value: number;
  discount_code: string;
  discount_start_date: string;
  discount_end_date: string;
  discount_max_uses?: number;
  discount_max_uses_per_user?: number;
  discount_min_order_value?: number;
  discount_applies_to: 'all' | 'specific';
  discount_product_ids?: string[];
}

class DiscountService {
  async getDiscountAmount(data: GetDiscountAmountData): Promise<ApiResponse<DiscountAmount>> {
    const response = await axiosInstance.post<ApiResponse<DiscountAmount>>(
      '/discount/amount',
      data
    );
    return response;
  }

  async getAllDiscountCodesWithProducts(): Promise<ApiResponse<Discount[]>> {
    const response = await axiosInstance.get<ApiResponse<Discount[]>>(
      '/discount/list_product_code'
    );
    return response;
  }

  async createDiscountCode(data: CreateDiscountData): Promise<ApiResponse<Discount>> {
    const response = await axiosInstance.post<ApiResponse<Discount>>('/discount', data);
    return response;
  }

  async getAllDiscountCodes(): Promise<ApiResponse<Discount[]>> {
    const response = await axiosInstance.get<ApiResponse<Discount[]>>('/discount');
    return response;
  }
}

export const discountService = new DiscountService();
export default discountService;

