import { create } from 'zustand';
import { orderService } from '../services/api';
import { Order } from '../types';

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
    statusFilter: string;
    page: number;
    totalPages: number;
}

interface OrderActions {
    fetchOrders: (status?: string, page?: number) => Promise<void>;
    fetchOrderDetail: (orderId: string) => Promise<void>;
    cancelOrder: (orderId: string, reason?: string) => Promise<boolean>;
    setStatusFilter: (status: string) => void;
    clearCurrentOrder: () => void;
    clearError: () => void;
}

type OrderStore = OrderState & OrderActions;

const useOrderStore = create<OrderStore>((set, get) => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    statusFilter: 'all',
    page: 1,
    totalPages: 1,

    fetchOrders: async (status?: string, page: number = 1) => {
        try {
            set({ loading: true, error: null });
            const filterStatus = status || get().statusFilter;
            const response = await orderService.getOrders({
                page,
                limit: 20,
                status: filterStatus === 'all' ? undefined : filterStatus,
            });
            const data = response?.metadata;
            set({
                orders: Array.isArray(data) ? data : [],
                loading: false,
                page,
            });
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to fetch orders';
            set({ error: errorMessage, loading: false });
        }
    },

    fetchOrderDetail: async (orderId: string) => {
        try {
            set({ loading: true, error: null });
            const response = await orderService.getOrderDetail(orderId);
            set({ currentOrder: response?.metadata || null, loading: false });
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to fetch order detail';
            set({ error: errorMessage, loading: false });
        }
    },

    cancelOrder: async (orderId: string, reason?: string): Promise<boolean> => {
        try {
            set({ loading: true, error: null });
            await orderService.cancelOrder(orderId, { reason });
            // Refresh orders list and current order
            const { statusFilter, page } = get();
            await get().fetchOrders(statusFilter, page);
            // Also update current order if viewing it
            const currentOrder = get().currentOrder;
            if (currentOrder && currentOrder._id === orderId) {
                await get().fetchOrderDetail(orderId);
            }
            set({ loading: false });
            return true;
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to cancel order';
            set({ error: errorMessage, loading: false });
            return false;
        }
    },

    setStatusFilter: (status: string) => {
        set({ statusFilter: status });
    },

    clearCurrentOrder: () => {
        set({ currentOrder: null });
    },

    clearError: () => {
        set({ error: null });
    },
}));

export default useOrderStore;
