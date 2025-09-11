import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterOptions } from '@/components/ProductFilter';

const FILTER_STORAGE_KEY = 'product_filters';

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

export function useFilterPersistence() {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from storage on mount
  useEffect(() => {
    loadFilters();
  }, []);

  // Save filters to storage whenever they change (debounced)
  useEffect(() => {
    if (isLoaded) {
      const timeoutId = setTimeout(() => {
        saveFilters(filters);
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [filters, isLoaded]);

  const loadFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) {
        const parsedFilters = JSON.parse(savedFilters);
        // Merge with default filters to ensure all properties exist
        setFilters({ ...defaultFilters, ...parsedFilters });
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveFilters = async (filtersToSave: FilterOptions) => {
    try {
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtersToSave));
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  };

  const clearSavedFilters = async () => {
    try {
      await AsyncStorage.removeItem(FILTER_STORAGE_KEY);
      setFilters(defaultFilters);
    } catch (error) {
      console.warn('Failed to clear saved filters:', error);
    }
  };

  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const updatePartialFilters = (partialFilters: Partial<FilterOptions>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...partialFilters }));
  };

  return {
    filters,
    isLoaded,
    updateFilters,
    updatePartialFilters,
    clearSavedFilters,
    defaultFilters,
  };
}