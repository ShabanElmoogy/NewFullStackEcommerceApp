import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isNew?: boolean;
  isTrending?: boolean;
  stock?: number;
  brand?: string;
  category?: string;
  specifications?: Record<string, string>;
  features?: string[];
}

interface CompareState {
  compareList: Product[];
  isCompareMode: boolean;
  maxCompareItems: number;
}

interface CompareActions {
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  toggleCompareMode: () => void;
  isInCompare: (productId: number) => boolean;
  canAddMore: () => boolean;
  getCompareCount: () => number;
}

type CompareStore = CompareState & CompareActions;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      // State
      compareList: [],
      isCompareMode: false,
      maxCompareItems: 4, // Maximum 4 products for comparison

      // Actions
      addToCompare: (product: Product) => {
        const { compareList, maxCompareItems } = get();
        
        // Check if product already exists
        if (compareList.some(item => item.id === product.id)) {
          return;
        }
        
        // Check if we've reached the maximum
        if (compareList.length >= maxCompareItems) {
          return;
        }
        
        set({
          compareList: [...compareList, product],
        });
      },

      removeFromCompare: (productId: number) => {
        set(state => ({
          compareList: state.compareList.filter(item => item.id !== productId),
        }));
      },

      clearCompare: () => {
        set({
          compareList: [],
          isCompareMode: false,
        });
      },

      toggleCompareMode: () => {
        set(state => ({
          isCompareMode: !state.isCompareMode,
        }));
      },

      isInCompare: (productId: number) => {
        const { compareList } = get();
        return compareList.some(item => item.id === productId);
      },

      canAddMore: () => {
        const { compareList, maxCompareItems } = get();
        return compareList.length < maxCompareItems;
      },

      getCompareCount: () => {
        const { compareList } = get();
        return compareList.length;
      },
    }),
    {
      name: 'compare-store',
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);