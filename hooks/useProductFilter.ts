import { useMemo } from 'react';
import { FilterOptions } from '@/components/ProductFilter';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  createdAt?: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  onSale?: boolean;
  originalPrice?: number;
  popularity?: number; // Could be based on views, purchases, etc.
}

export function useProductFilter(products: Product[], filters: FilterOptions) {
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    let filtered = [...products];

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        product.category && filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        product.brand && filters.brands.includes(product.brand)
      );
    }

    // Rating filter
    if (filters.minRating && filters.minRating > 0) {
      filtered = filtered.filter(product =>
        product.rating && product.rating >= filters.minRating
      );
    }

    // Stock filter
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => {
        if (filters.inStock === true) {
          return product.inStock === true || (product.stockQuantity && product.stockQuantity > 0);
        } else if (filters.inStock === false) {
          return product.inStock === false || (product.stockQuantity !== undefined && product.stockQuantity <= 0);
        }
        return true; // Show all if null
      });
    }

    // On Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product =>
        product.onSale === true || (product.originalPrice && product.originalPrice > product.price)
      );
    }

    // Price range filter
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => {
          const productPrice = typeof product.price === 'string' 
            ? parseFloat(product.price.replace(/[^0-9.-]+/g, '')) 
            : product.price;
          return productPrice >= minPrice;
        });
      }
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => {
          const productPrice = typeof product.price === 'string' 
            ? parseFloat(product.price.replace(/[^0-9.-]+/g, '')) 
            : product.price;
          return productPrice <= maxPrice;
        });
      }
    }

    // Sort filter
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, '')) 
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, '')) 
            : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'string' 
            ? parseFloat(a.price.replace(/[^0-9.-]+/g, '')) 
            : a.price;
          const priceB = typeof b.price === 'string' 
            ? parseFloat(b.price.replace(/[^0-9.-]+/g, '')) 
            : b.price;
          return priceB - priceA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          // If ratings are equal, sort by review count
          if (ratingA === ratingB) {
            return (b.reviewCount || 0) - (a.reviewCount || 0);
          }
          return ratingB - ratingA;
        });
        break;
      case 'popularity':
        filtered.sort((a, b) => {
          const popularityA = a.popularity || 0;
          const popularityB = b.popularity || 0;
          return popularityB - popularityA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  return {
    filteredProducts,
    totalCount: products?.length || 0,
    filteredCount: filteredProducts.length,
  };
}