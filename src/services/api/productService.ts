import axiosInstance from './axios';
import { ApiResponse, Product } from '../../types';

export interface CreateProductData {
  product_name: string;
  product_description?: string;
  product_price: number;
  product_quantity: number;
  product_type: string;
  product_thumb: string;
  product_attributes?: Record<string, any>;
}

class ProductService {
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    const response = await axiosInstance.get<ApiResponse<Product[]>>('/product');
    return response;
  }

  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    const response = await axiosInstance.get<ApiResponse<Product>>(`/product/${productId}`);
    return response;
  }

  async createProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    const response = await axiosInstance.post<ApiResponse<Product>>('/product', productData);
    return response;
  }

  async updateProduct(productId: string, productData: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
    const response = await axiosInstance.patch<ApiResponse<Product>>(`/product/${productId}`, productData);
    return response;
  }

  async deleteProduct(productId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/product/${productId}`);
    return response;
  }
}

export const productService = new ProductService();
export default productService;

