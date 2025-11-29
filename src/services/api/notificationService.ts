import axiosInstance from './axios';
import { ApiResponse, Notification } from '../../types';

class NotificationService {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const response = await axiosInstance.get<ApiResponse<Notification[]>>('/notification');
    return response;
  }
}

export const notificationService = new NotificationService();
export default notificationService;

