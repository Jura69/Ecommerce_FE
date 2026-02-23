import { create } from 'zustand';
import { cartService } from '../services/api';
import { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

interface CartActions {
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, shopId: string, productInfo?: {
    name?: string;
    price?: number;
    thumb?: string;
    skuId?: string;
    variationLabel?: string;
  }) => Promise<Cart | undefined>;
  removeFromCart: (productId: string, skuId?: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number, shopId: string, skuId?: string) => Promise<void>;
  getCartItemCount: () => number;
  clearCart: () => void;
}

type CartStore = CartState & CartActions;

const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    try {
      set({ loading: true, error: null });
      const response = await cartService.getCart();
      set({ cart: response?.metadata || null, loading: false });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch cart';
      set({ error: errorMessage, loading: false });
    }
  },

  addToCart: async (productId: string, quantity: number, shopId: string, productInfo?: {
    name?: string;
    price?: number;
    thumb?: string;
    skuId?: string;
    variationLabel?: string;
  }) => {
    try {
      set({ loading: true, error: null });
      const response = await cartService.addToCart({
        productId,
        quantity,
        shopId,
        skuId: productInfo?.skuId,
        ...productInfo,
      });
      await get().fetchCart();
      return response?.metadata;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to add to cart';
      set({ error: errorMessage, loading: false });
    }
  },

  removeFromCart: async (productId: string, skuId?: string) => {
    try {
      set({ loading: true, error: null });
      await cartService.removeFromCart({ productId, skuId });
      await get().fetchCart();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to remove from cart';
      set({ error: errorMessage, loading: false });
    }
  },

  updateItemQuantity: async (productId: string, quantity: number, shopId: string, skuId?: string) => {
    try {
      const originalCart = get().cart;
      if (!originalCart) return;

      // Optimistic update
      const updatedShops = originalCart.cart_shops.map((shop) => ({
        ...shop,
        items: shop.items.map((item) => {
          const itemKey = item.skuId ? `${item.productId}:${item.skuId}` : item.productId;
          const targetKey = skuId ? `${productId}:${skuId}` : productId;
          return itemKey === targetKey ? { ...item, quantity } : item;
        }),
      }));
      set({ cart: { ...originalCart, cart_shops: updatedShops } });

      await cartService.updateCartItemQuantity({ productId, quantity, shopId, skuId });
      await get().fetchCart();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update quantity';
      set({ error: errorMessage, loading: false });
      const originalCart = get().cart;
      if (originalCart) {
        set({ cart: originalCart });
      }
    }
  },

  getCartItemCount: (): number => {
    const { cart } = get();
    if (!cart || !cart.cart_shops) return 0;
    return cart.cart_shops.reduce(
      (total, shop) => total + shop.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
  },

  clearCart: () => {
    set({ cart: null });
  },
}));

export default useCartStore;
