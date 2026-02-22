import axiosInstance from './axios';
import { ApiResponse } from '../../types';

export interface ProfileData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    description?: string;
    status?: string;
    verify?: boolean;
    roles?: string[];
    createdAt?: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    avatar?: string;
    description?: string;
}

class ProfileService {
    async getProfile(): Promise<ApiResponse<ProfileData>> {
        const response = await axiosInstance.get('/profile');
        return response as unknown as ApiResponse<ProfileData>;
    }

    async updateProfile(data: UpdateProfileData): Promise<ApiResponse<ProfileData>> {
        const response = await axiosInstance.put('/profile', data);
        return response as unknown as ApiResponse<ProfileData>;
    }
}

export const profileService = new ProfileService();
export default profileService;
