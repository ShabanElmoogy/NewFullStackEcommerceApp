import { createPersistentStore, clearPersistedData } from './persistenceUtils';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface WishlistItem {
  product: Product;
  addedAt: string; // Changed from Date to string for better serialization
}

export interface WishlistStore {
  items: WishlistItem[];

  // Actions
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;

  // Computed values
  totalItems: () => number;
}

const wishlistStoreConfig = (set: any, get: any) => ({
  items: [],

  addProduct: (product: Product) => {
    const items = get().items;
    const exists = items.find((item: WishlistItem) => item.product.id === product.id);

    if (!exists) {
      // Add product to wishlist
      set({ 
        items: [...items, { 
          product, 
          addedAt: new Date().toISOString() // Store as ISO string for better serialization
        }] 
      });
    }
  },

  removeProduct: (productId: number) => {
    set({
      items: get().items.filter((item: WishlistItem) => item.product.id !== productId),
    });
  },

  clearWishlist: async () => {
    set({ items: [] });
    // Clear persisted wishlist data
    try {
      await clearPersistedData('wishlist-storage');
    } catch (error) {
      console.warn('Error clearing wishlist data:', error);
    }
  },

  isInWishlist: (productId: number) => {
    return get().items.some((item: WishlistItem) => item.product.id === productId);
  },

  // Computed values
  totalItems: () => get().items.length,
});

export const useWishlist = createPersistentStore<WishlistStore>(
  wishlistStoreConfig,
  {
    name: 'wishlist-storage',
    partialize: (state) => ({
      items: state.items,
    }),
    onRehydrateStorage: (state) => {
      console.log('Wishlist store rehydrated:', { 
        itemCount: state.items.length,
        totalItems: state.totalItems()
      });
    }
  }
);