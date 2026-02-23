import { create } from 'zustand';
import { followService } from '../services/api/followService';

interface FollowState {
    followedShopIds: Set<string>;
    loading: boolean;

    // Actions
    followShop: (shopId: string) => Promise<void>;
    unfollowShop: (shopId: string) => Promise<void>;
    checkFollow: (shopId: string) => Promise<boolean>;
    fetchFollows: () => Promise<void>;
    isFollowing: (shopId: string) => boolean;
}

export const useFollowStore = create<FollowState>((set, get) => ({
    followedShopIds: new Set<string>(),
    loading: false,

    followShop: async (shopId: string) => {
        // Optimistic update
        set((state) => {
            const newSet = new Set(state.followedShopIds);
            newSet.add(shopId);
            return { followedShopIds: newSet };
        });

        try {
            await followService.followShop(shopId);
        } catch (error) {
            // Rollback on error
            set((state) => {
                const newSet = new Set(state.followedShopIds);
                newSet.delete(shopId);
                return { followedShopIds: newSet };
            });
            throw error;
        }
    },

    unfollowShop: async (shopId: string) => {
        // Optimistic update
        set((state) => {
            const newSet = new Set(state.followedShopIds);
            newSet.delete(shopId);
            return { followedShopIds: newSet };
        });

        try {
            await followService.unfollowShop(shopId);
        } catch (error) {
            // Rollback on error
            set((state) => {
                const newSet = new Set(state.followedShopIds);
                newSet.add(shopId);
                return { followedShopIds: newSet };
            });
            throw error;
        }
    },

    checkFollow: async (shopId: string) => {
        try {
            const response = await followService.checkFollow(shopId);
            const isFollowing = response.metadata?.isFollowing ?? false;

            set((state) => {
                const newSet = new Set(state.followedShopIds);
                if (isFollowing) newSet.add(shopId);
                else newSet.delete(shopId);
                return { followedShopIds: newSet };
            });

            return isFollowing;
        } catch {
            return false;
        }
    },

    fetchFollows: async () => {
        set({ loading: true });
        try {
            const response = await followService.getMyFollows(1, 100);
            const shops = response.metadata?.shops ?? [];
            const ids = new Set(shops.map((s: any) => s._id));
            set({ followedShopIds: ids, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    isFollowing: (shopId: string) => {
        return get().followedShopIds.has(shopId);
    },
}));
