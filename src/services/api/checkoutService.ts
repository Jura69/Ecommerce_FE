import axiosInstance from './axios';
import { ApiResponse, CheckoutReview } from '../../types';

export interface CheckoutData {
  shop_order_ids: Array<{
    shopId: string;
    shop_discounts?: Array<{
      codeId: string;
      discountId: string;
    }>;
    item_products: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  }>;
  user_address: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country?: string;
  };
  user_payment: {
    method: string;
  };
}

class CheckoutService {
  async checkoutReview(checkoutData: CheckoutData): Promise<ApiResponse<CheckoutReview>> {
    const response = await axiosInstance.post<ApiResponse<CheckoutReview>>(
      '/checkout/review',
      checkoutData
    );
    return response;
  }
}

export const checkoutService = new CheckoutService();
export default checkoutService;

