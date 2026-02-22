import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface AddressData {
    _id: string;
    address_userId: string;
    address_fullName: string;
    address_phone: string;
    address_street: string;
    address_city: string;
    address_state?: string;
    address_zipCode: string;
    address_country: string;
    address_isDefault: boolean;
    address_label?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAddressData {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country?: string;
    isDefault?: boolean;
    label?: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> { }

class AddressService {
    async getAddresses(): Promise<ApiResponse<AddressData[]>> {
        const response = await axiosInstance.get('/address');
        return response as unknown as ApiResponse<AddressData[]>;
    }

    async createAddress(data: CreateAddressData): Promise<ApiResponse<AddressData>> {
        const response = await axiosInstance.post('/address', data);
        return response as unknown as ApiResponse<AddressData>;
    }

    async updateAddress(addressId: string, data: UpdateAddressData): Promise<ApiResponse<AddressData>> {
        const response = await axiosInstance.put(`/address/${addressId}`, data);
        return response as unknown as ApiResponse<AddressData>;
    }

    async deleteAddress(addressId: string): Promise<ApiResponse<{ deleted: boolean }>> {
        const response = await axiosInstance.delete(`/address/${addressId}`);
        return response as unknown as ApiResponse<{ deleted: boolean }>;
    }

    async setDefault(addressId: string): Promise<ApiResponse<{ addressId: string; isDefault: boolean }>> {
        const response = await axiosInstance.patch(`/address/${addressId}/default`);
        return response as unknown as ApiResponse<{ addressId: string; isDefault: boolean }>;
    }
}

export const addressService = new AddressService();
export default addressService;
