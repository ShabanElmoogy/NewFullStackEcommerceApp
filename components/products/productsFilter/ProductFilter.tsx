import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { PackageIcon } from 'lucide-react-native';
import { useCategories } from '@/hooks/useCategories';
import { useSubCategories } from '@/hooks/useSubCategories';
import { getCategoriesForFilter, getSubCategoriesForFilter } from '@/utils/categoryUtils';
import { useTheme } from '@/hooks/useTheme';

// Import filter components
import FilterButton from '../../filters/FilterButton';
import FilterModal from '../../filters/FilterModal';
import CategoriesFilter from '../../filters/CategoriesFilter';
import BrandsFilter from '../../filters/BrandsFilter';
import PriceRangeFilter from '../../filters/PriceRangeFilter';
import RatingFilter from '../../filters/RatingFilter';
import AvailabilityFilter from '../../filters/AvailabilityFilter';
import SortFilter from '../../filters/SortFilter';

export interface FilterOptions {
  searchQuery: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest' | 'rating' | 'popularity';
  minPrice: string;
  maxPrice: string;
  categories: string[];
  brands: string[];
  minRating: number;
  inStock: boolean | null; // null = all, true = in stock only, false = out of stock only
  onSale: boolean;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  productCount: number;
}

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

const brandOptions = [
  { value: 'Apple', label: 'Apple', icon: PackageIcon, color: '#6B7280' },
  { value: 'Samsung', label: 'Samsung', icon: PackageIcon, color: '#3B82F6' },
  { value: 'Nike', label: 'Nike', icon: PackageIcon, color: '#000000' },
  { value: 'Adidas', label: 'Adidas', icon: PackageIcon, color: '#000000' },
  { value: 'Sony', label: 'Sony', icon: PackageIcon, color: '#000000' },
  { value: 'LG', label: 'LG', icon: PackageIcon, color: '#DC2626' },
];

export default function ProductFilter({ onFilterChange, activeFilters, productCount }: ProductFilterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { colors, isDark } = useTheme();
  
  // Fetch real category and subcategory data
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: subCategoriesData, isLoading: subCategoriesLoading } = useSubCategories();
  
  // Transform categories for filter options - only use real API data
  const realCategoryOptions = categoriesData ? getCategoriesForFilter(categoriesData, 'en') : [];
  const realSubCategoryOptions = subCategoriesData ? getSubCategoriesForFilter(subCategoriesData, 'en') : [];

    
  // Default filter values to prevent undefined errors
  const defaultFilters: FilterOptions = {
    searchQuery: '',
    sortBy: 'name',
    minPrice: '',
    maxPrice: '',
    categories: [],
    brands: [],
    minRating: 0,
    inStock: null,
    onSale: false,
  };

  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters || defaultFilters);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activeFilters) {
      setLocalFilters(activeFilters);
    }
  }, [activeFilters]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isScrolledToTop = contentOffset.y <= 10;
    const isNearBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 50;
    
    // Hide scroll hint when user starts scrolling or reaches near bottom
    if (!isScrolledToTop || isNearBottom) {
      setShowScrollHint(false);
    }
  };

  const resetScrollHint = () => {
    setShowScrollHint(true);
  };

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    closeModal();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      searchQuery: '',
      sortBy: 'name',
      minPrice: '',
      maxPrice: '',
      categories: [],
      brands: [],
      minRating: 0,
      inStock: null,
      onSale: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    closeModal();
  };

  const toggleCategory = (category: string) => {
    setLocalFilters(prev => {
      const categories = prev.categories || [];
      return {
        ...prev,
        categories: categories.includes(category)
          ? categories.filter(c => c !== category)
          : [...categories, category]
      };
    });
  };

  const toggleBrand = (brand: string) => {
    setLocalFilters(prev => {
      const brands = prev.brands || [];
      return {
        ...prev,
        brands: brands.includes(brand)
          ? brands.filter(b => b !== brand)
          : [...brands, brand]
      };
    });
  };

  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    
    let count = 0;
    if (activeFilters.searchQuery) count++;
    if (activeFilters.sortBy !== 'name') count++;
    if (activeFilters.minPrice) count++;
    if (activeFilters.maxPrice) count++;
    if (activeFilters.categories && activeFilters.categories.length > 0) count++;
    if (activeFilters.brands && activeFilters.brands.length > 0) count++;
    if (activeFilters.minRating > 0) count++;
    if (activeFilters.inStock !== null) count++;
    if (activeFilters.onSale) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      <FilterButton 
        onPress={openModal}
        activeFilterCount={activeFilterCount}
      />

      <FilterModal
        isVisible={isVisible}
        onClose={closeModal}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        scrollViewRef={scrollViewRef}
        productCount={productCount}
      >
        <CategoriesFilter
          categories={realCategoryOptions}
          selectedCategories={localFilters.categories || []}
          onToggleCategory={toggleCategory}
          isLoading={categoriesLoading}
          isDark={isDark}
        />

        <BrandsFilter
          brands={brandOptions}
          selectedBrands={localFilters.brands || []}
          onToggleBrand={toggleBrand}
          isDark={isDark}
        />

        <PriceRangeFilter
          minPrice={localFilters.minPrice}
          maxPrice={localFilters.maxPrice}
          onMinPriceChange={(text) => setLocalFilters(prev => ({ ...prev, minPrice: text }))}
          onMaxPriceChange={(text) => setLocalFilters(prev => ({ ...prev, maxPrice: text }))}
          scrollViewRef={scrollViewRef}
        />

        <RatingFilter
          minRating={localFilters.minRating}
          onRatingChange={(rating) => setLocalFilters(prev => ({ 
            ...prev, 
            minRating: rating 
          }))}
        />

        <AvailabilityFilter
          inStock={localFilters.inStock}
          onSale={localFilters.onSale}
          onStockChange={(value) => setLocalFilters(prev => ({ ...prev, inStock: value }))}
          onSaleChange={(value) => setLocalFilters(prev => ({ ...prev, onSale: value }))}
        />

        <SortFilter
          sortBy={localFilters.sortBy}
          onSortChange={(value) => setLocalFilters(prev => ({ ...prev, sortBy: value as any }))}
          sortOptions={sortOptions}
        />
      </FilterModal>
    </>
  );
}