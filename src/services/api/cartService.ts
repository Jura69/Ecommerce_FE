import axiosInstance from './axios';
import { ApiResponse, Cart, CartProduct } from '../../types';

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface RemoveFromCartData {
  productId: string;
}

export interface UpdateCartQuantityData {
  productId: string;
  quantity: number;
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
      data: { productId: data.productId },
    });
    return response;
  }

  async updateCartItemQuantity(data: UpdateCartQuantityData): Promise<ApiResponse<Cart>> {
    const response = await axiosInstance.patch<ApiResponse<Cart>>('/cart', {
      shop_order_ids: [
        {
          shopId: '',
          item_products: [
            {
              productId: data.productId,
              quantity: data.quantity,
            },
          ],
          version: '',
        },
      ],
    });
    return response;
  }
}

export const cartService = new CartService();
export default cartService;

