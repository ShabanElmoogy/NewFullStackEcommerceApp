import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Basic product type used in the cart
export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number; // always > 0
}

export interface CartStore {
  // State
  items: CartItem[];

  // Actions
  addProduct: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  increaseQuantity: (productId: number, delta?: number) => void;
  decreaseQuantity: (productId: number, delta?: number) => void;
  removeProduct: (productId: number) => void;
  resetCart: () => void;

  // Selectors (computed on demand)
  hasItem: (productId: number) => boolean;
  getQuantity: (productId: number) => number;
  totalQuantity: () => number;
  totalPrice: () => number;
}

const STORAGE_KEY = 'cart-storage';
const STORE_VERSION = 2;

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (product, quantity = 1) => {
        if (quantity <= 0) return;
        const items = [...get().items];
        const index = items.findIndex((it) => it.product.id === product.id);
        if (index > -1) {
          items[index] = { ...items[index], quantity: items[index].quantity + quantity };
        } else {
          items.push({ product, quantity });
        }
        set({ items });
      },

      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((it) => it.product.id !== productId) });
          return;
        }
        const items = [...get().items];
        const index = items.findIndex((it) => it.product.id === productId);
        if (index > -1) {
          items[index] = { ...items[index], quantity };
          set({ items });
        }
      },

      increaseQuantity: (productId, delta = 1) => {
        if (delta <= 0) return;
        const items = get().items.map((it) =>
          it.product.id === productId ? { ...it, quantity: it.quantity + delta } : it
        );
        set({ items });
      },

      decreaseQuantity: (productId, delta = 1) => {
        if (delta <= 0) return;
        const items = get().items
          .map((it) =>
            it.product.id === productId ? { ...it, quantity: it.quantity - delta } : it
          )
          .filter((it) => it.quantity > 0);
        set({ items });
      },

      removeProduct: (productId) => {
        set({ items: get().items.filter((it) => it.product.id !== productId) });
      },

      resetCart: () => set({ items: [] }),

      // Selectors
      hasItem: (productId) => get().items.some((it) => it.product.id === productId),
      getQuantity: (productId) => get().items.find((it) => it.product.id === productId)?.quantity ?? 0,
      totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + item.quantity * item.product.price, 0),
    }),
    {
      name: STORAGE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      // Persist only the items array
      partialize: (state) => ({ items: state.items }),
      // Ensure older shapes migrate to the current one safely
      migrate: (persistedState, version) => {
        const state = persistedState as any;
        let items: any[] = Array.isArray(state?.items) ? state.items : [];
        items = items
          .map((it) => {
            const product = it?.product ?? it;
            const quantity = typeof it?.quantity === 'number' && it.quantity > 0 ? it.quantity : 1;
            if (!product || typeof product.id !== 'number') return null;
            return { product, quantity } as CartItem;
          })
          .filter(Boolean);
        return { items } as Pick<CartStore, 'items'>;
      },
    }
  )
);
