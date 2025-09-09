import { createPersistentStore, clearPersistedData } from './persistenceUtils';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];

  // Actions
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  resetCart: () => void;

  // Computed values
  totalQuantity: () => number;
  totalPrice: () => number;
}

const cartStoreConfig = (set: any, get: any) => ({
  items: [],

  addProduct: (product: Product) => {
    const items = get().items;
    const index = items.findIndex((item: CartItem) => item.product.id === product.id);

    if (index > -1) {
      // Product already exists, increase quantity
      const newItems = [...items];
      newItems[index].quantity += 1;
      set({ items: newItems });
    } else {
      // New product, add it
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },

  removeProduct: (productId: number) => {
    set({
      items: get().items.filter((item: CartItem) => item.product.id !== productId),
    });
  },

  increaseQuantity: (productId: number) => {
    const newItems = get().items.map((item: CartItem) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    set({ items: newItems });
  },

  decreaseQuantity: (productId: number) => {
    const newItems = get().items.map((item: CartItem) =>
      item.product.id === productId
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    set({ items: newItems });
  },

  resetCart: async () => {
    set({ items: [] });
    // Clear persisted cart data
    try {
      await clearPersistedData('cart-storage');
    } catch (error) {
      console.warn('Error clearing cart data:', error);
    }
  },

  // Computed values
  totalQuantity: () => get().items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),
  totalPrice: () =>
    get().items.reduce((acc: number, item: CartItem) => acc + item.quantity * item.product.price, 0),
});

export const useCart = createPersistentStore<CartStore>(
  cartStoreConfig,
  {
    name: 'cart-storage',
    partialize: (state) => ({
      items: state.items,
    }),
    onRehydrateStorage: (state) => {
      console.log('Cart store rehydrated:', { 
        itemCount: state.items.length,
        totalQuantity: state.totalQuantity(),
        totalPrice: state.totalPrice()
      });
    }
  }
);
