import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { useSearchStore } from "@/store/searchStore";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";
import { useViewModePersistence } from "@/hooks/useViewModePersistence";
import { useNumColumns } from "@/hooks/useNumColumns";
import { FilterOptions } from "../../productsFilter/ProductFilter";

export function useProductsLogic() {
  const [refreshing, setRefreshing] = useState(false);
  const appliedCategoryRef = useRef<string | null>(null);

  // Get URL parameters for category filtering
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;
  const categoryName = params.categoryName as string;

  // Persistent filters
  const { filters, isLoaded: filtersLoaded, updateFilters, updatePartialFilters, defaultFilters } =
    useFilterPersistence();

  // Zustand search
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const clearSearchQuery = useSearchStore((s) => s.clearSearchQuery);

  // Apply category filter when coming from home screen (only once per categoryId)
  useEffect(() => {
    if (categoryId && filtersLoaded && filters && appliedCategoryRef.current !== categoryId) {
      // Check if the category is not already in the filters
      if (!filters.categories.includes(categoryId)) {
        updatePartialFilters({ 
          categories: [...filters.categories, categoryId] 
        });
      }
      appliedCategoryRef.current = categoryId;
    }
  }, [categoryId, filtersLoaded, filters, updatePartialFilters]);

  // Sync Zustand <-> persisted filters
  useEffect(() => {
    if (filters && filters.searchQuery !== searchQuery) {
      updatePartialFilters({ searchQuery });
    }
  }, [searchQuery, filters, updatePartialFilters]);

  // Persistent view mode
  const { viewMode, isLoaded: viewModeLoaded, updateViewMode } = useViewModePersistence();

  // Columns
  const baseNumColumns = useNumColumns();
  const numOfColumns = viewMode === "list" ? 1 : baseNumColumns;

  // Products
  const { data, isLoading, error, refetch } = useProducts();
  const products = Array.isArray(data) ? data : data?.products ?? [];
  const { filteredProducts, totalCount, filteredCount } = useProductFilter(products, filters);

  // Handlers
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => updateFilters(newFilters), [updateFilters]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      updatePartialFilters({ searchQuery: query });
      if (!query.trim()) clearSearchQuery();
    },
    [setSearchQuery, updatePartialFilters, clearSearchQuery]
  );

  const handleRemoveFilter = useCallback(
    (key: keyof FilterOptions) => {
      const reset: Partial<FilterOptions> = {
        searchQuery: "",
        sortBy: "name",
        minPrice: "",
        maxPrice: "",
        categories: [],
        brands: [],
        minRating: 0,
        inStock: null,
        onSale: false,
      };
      updatePartialFilters({ [key]: reset[key] });
      // Keep the search input in sync when removing the search badge
      if (key === 'searchQuery') {
        setSearchQuery("");
        clearSearchQuery();
      }
    },
    [updatePartialFilters, setSearchQuery, clearSearchQuery]
  );

  const handleClearAllFilters = useCallback(() => {
    updateFilters(defaultFilters);
    // Also clear the global search store so the input resets
    setSearchQuery("");
    clearSearchQuery();
  }, [updateFilters, defaultFilters, setSearchQuery, clearSearchQuery]);

  // Derived state
  const hasActiveFiltersOrSearch = useMemo(() => {
    if (!filters) return false;
    return (
      !!filters.searchQuery?.trim() ||
      filters.sortBy !== "name" ||
      !!filters.minPrice ||
      !!filters.maxPrice ||
      filters.categories?.length > 0 ||
      filters.brands?.length > 0 ||
      filters.minRating > 0 ||
      filters.inStock !== null ||
      filters.onSale
    );
  }, [filters]);

  const hasResults = filteredProducts.length > 0;
  const isSearching = !!filters?.searchQuery?.trim();

  return {
    // State
    refreshing,
    categoryId,
    categoryName,
    filters,
    searchQuery,
    viewMode,
    numOfColumns,
    filteredProducts,
    totalCount,
    filteredCount,
    hasActiveFiltersOrSearch,
    hasResults,
    isSearching,
    
    // Loading states
    isLoading: isLoading || !filtersLoaded || !viewModeLoaded,
    error,
    
    // Handlers
    onRefresh,
    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearAllFilters,
    updateViewMode,
  };
}