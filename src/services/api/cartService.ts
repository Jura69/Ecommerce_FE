import axiosInstance from './axios';
import { ApiResponse, Cart } from '../../types';

export interface AddToCartData {
  productId: string;
  shopId: string;
  quantity: number;
  skuId?: string;
  name?: string;
  price?: number;
  thumb?: string;
}

export interface RemoveFromCartData {
  productId: string;
  skuId?: string;
}

export interface UpdateCartQuantityData {
  productId: string;
  shopId: string;
  quantity: number;
  skuId?: string;
}

class CartService {
  async getCart(): Promise<ApiResponse<Cart>> {
    const response = await axiosInstance.get<ApiResponse<Cart>>('/cart');
    return response;
  }

  async addToCart(product: AddToCartData): Promise<ApiResponse<Cart>> {
    const response = await axiosInstance.post<ApiResponse<Cart>>('/cart', { product });
    return response;
  }

  async removeFromCart(data: RemoveFromCartData): Promise<ApiResponse<Cart>> {
    const response = await axiosInstance.delete<ApiResponse<Cart>>('/cart', {
      data: { productId: data.productId, skuId: data.skuId },
    });
    return response;
  }

  async updateCartItemQuantity(data: UpdateCartQuantityData): Promise<ApiResponse<Cart>> {
    const response = await axiosInstance.patch<ApiResponse<Cart>>('/cart', {
      product: {
        productId: data.productId,
        shopId: data.shopId,
        skuId: data.skuId,
        quantity: data.quantity,
      },
    });
    return response;
  }
}

export const cartService = new CartService();
export default cartService;
