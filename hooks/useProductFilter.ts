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
        product.category?.toLowerCase().includes(query)
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