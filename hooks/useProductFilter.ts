import { useMemo } from 'react';
import { FilterOptions } from '@/components/products/productsFilter/ProductFilter';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  createdOn?: string;
  updatedOn?: string;
  isDeleted?: boolean;
  // API returns flattened category structure
  categoryId?: number | null;
  categoryNameAr?: string | null;
  categoryNameEn?: string | null;
  subCategoryId?: number | null;
  subCategoryNameAr?: string | null;
  subCategoryNameEn?: string | null;
  // Legacy support for nested structure
  category?: {
    id: number;
    nameAr: string;
    nameEn: string;
  } | string;
  subCategory?: {
    id: number;
    nameAr: string;
    nameEn: string;
  };
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  onSale?: boolean;
  originalPrice?: number;
  popularity?: number;
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
      filtered = filtered.filter(product => {
        // Check name and description
        const nameMatch = product.name?.toLowerCase().includes(query);
        const descriptionMatch = product.description?.toLowerCase().includes(query);
        const brandMatch = product.brand?.toLowerCase().includes(query);
        
        // Check flattened category structure
        const categoryMatchFlat = product.categoryNameEn?.toLowerCase().includes(query) ||
                                 product.categoryNameAr?.toLowerCase().includes(query);
        
        const subCategoryMatchFlat = product.subCategoryNameEn?.toLowerCase().includes(query) ||
                                    product.subCategoryNameAr?.toLowerCase().includes(query);
        
        // Check legacy nested category structure
        let categoryMatchNested = false;
        if (product.category) {
          if (typeof product.category === 'object') {
            categoryMatchNested = product.category.nameEn?.toLowerCase().includes(query) ||
                                 product.category.nameAr?.toLowerCase().includes(query);
          } else if (typeof product.category === 'string') {
            categoryMatchNested = product.category.toLowerCase().includes(query);
          }
        }
        
        // Check legacy nested subcategory structure
        let subCategoryMatchNested = false;
        if (product.subCategory) {
          subCategoryMatchNested = product.subCategory.nameEn?.toLowerCase().includes(query) ||
                                  product.subCategory.nameAr?.toLowerCase().includes(query);
        }
        
        return nameMatch || descriptionMatch || brandMatch || 
               categoryMatchFlat || subCategoryMatchFlat ||
               categoryMatchNested || subCategoryMatchNested;
      });
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => {
        // Check flattened API structure first (categoryId field)
        if (product.categoryId !== null && product.categoryId !== undefined) {
          const matches = filters.categories.some(filterCategoryId => {
            // Try both string and integer comparison
            return filterCategoryId === product.categoryId!.toString() || 
                   parseInt(filterCategoryId) === product.categoryId!;
          });
          
          return matches;
        }
        
        // Fallback to legacy nested structure
        if (product.category) {
          if (typeof product.category === 'object' && product.category.id !== undefined) {
            // Legacy nested format: category is an object with id
            const categoryId = product.category.id;
            
            const matches = filters.categories.some(filterCategoryId => {
              return filterCategoryId === categoryId.toString() || 
                     parseInt(filterCategoryId) === categoryId;
            });
            
            return matches;
          } else if (typeof product.category === 'string') {
            // Legacy string format
            const matches = filters.categories.includes(product.category);
            return matches;
          }
        }
        
        return false;
      });
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
