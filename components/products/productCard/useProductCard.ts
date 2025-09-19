import { useLanguageStore } from "@/store/languageStore";
import { Product } from "./types";

interface UseProductCardReturn {
  // Product properties
  name: string;
  price: number;
  image?: string;
  description?: string;
  rating: number;
  reviewCount: number;
  discount: number;
  isNew?: boolean;
  isTrending?: boolean;
  stock: number;
  
  // Language/RTL
  isRTL: boolean;
  
  // Computed states
  isOutOfStock: boolean;
  isLowStock: boolean;
  hasDiscount: boolean;
}

/**
 * Custom hook for product card logic and state management
 * Extracts product properties and computes common states used across different product card views
 * 
 * @param product - The product object
 * @returns Object containing product properties, RTL state, and computed states
 */
export function useProductCard(product: Product): UseProductCardReturn {
  // Extract product properties with defaults
  const { 
    name, 
    price, 
    image, 
    description, 
    rating = 0, 
    reviewCount = 0, 
    discount = 3, 
    isNew, 
    isTrending, 
    stock = 10 
  } = product;

  // Get RTL state from language store
  const { isRTL } = useLanguageStore();

  // Compute stock states
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  
  // Compute discount state
  const hasDiscount = discount && discount > 0;

  return {
    // Product properties
    name,
    price,
    image,
    description,
    rating,
    reviewCount,
    discount,
    isNew,
    isTrending,
    stock,
    
    // Language/RTL
    isRTL,
    
    // Computed states
    isOutOfStock,
    isLowStock,
    hasDiscount,
  };
}
