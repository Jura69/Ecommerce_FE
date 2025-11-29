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
  addToCart: (productId: string, quantity: number) => Promise<Cart | undefined>;
  removeFromCart: (productId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
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

  addToCart: async (productId: string, quantity: number) => {
    try {
      set({ loading: true, error: null });
      const response = await cartService.addToCart({ productId, quantity });
      await get().fetchCart();
      return response?.metadata;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to add to cart';
      set({ error: errorMessage, loading: false });
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      set({ loading: true, error: null });
      await cartService.removeFromCart({ productId });
      await get().fetchCart();
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to remove from cart';
      set({ error: errorMessage, loading: false });
    }
  },

  updateItemQuantity: async (productId: string, quantity: number) => {
    try {
      const originalCart = get().cart;
      if (!originalCart) return;

      const updatedItems = originalCart.cart_products.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      set({ cart: { ...originalCart, cart_products: updatedItems } });

      await cartService.updateCartItemQuantity({ productId, quantity });
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
    if (!cart || !cart.cart_products) return 0;
    return cart.cart_products.reduce((total, item) => total + item.quantity, 0);
  },

  clearCart: () => {
    set({ cart: null });
  },
}));

export default useCartStore;

