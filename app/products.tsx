import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
} from "react-native";
import {
  AlertCircleIcon,
} from "lucide-react-native";

import ProductCard from "../components/products/productCard/ProductCard";
import ProductFilter, { FilterOptions } from "../components/products/productsFilter/ProductFilter";
import ProductSearch from "../components/products/productCard/ProductSearch";
import ActiveFilters from "../components/products/productsFilter/ActiveFilters";
import { useSearchStore } from "../store/searchStore";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";
import { useViewModePersistence } from "@/hooks/useViewModePersistence";
import { useTheme } from "@/hooks/useTheme";
import { useNumColumns } from "@/hooks/useNumColumns";
import { Text } from "../components/ui/text";
import { VStack } from "../components/ui/vstack";
import { Button, ButtonText } from "../components/ui/button";
import ResultsHeader from "../components/products/productsFilter/ResultsHeader";
import NoResultsState from "../components/products/productsFilter/NoResultsState";
import EmptyState from "../components/products/productsFilter/EmptyState";

export default function ProductsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  // Persistent filters
  const { filters, isLoaded: filtersLoaded, updateFilters, updatePartialFilters, defaultFilters } =
    useFilterPersistence();

  // Zustand search
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const clearSearchQuery = useSearchStore((s) => s.clearSearchQuery);

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

  // Loading
  if (isLoading || !filtersLoaded || !viewModeLoaded) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-base" style={{ color: colors.textSecondary }}>
          Loading products...
        </Text>
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <VStack className="flex-1 justify-center items-center px-8" style={{ backgroundColor: colors.background }}>
        <AlertCircleIcon color={colors.error} size={48} />
        <Text className="text-xl font-bold mt-4 mb-2 text-center" style={{ color: colors.text }}>
          Something went wrong
        </Text>
        <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
          {error.message}
        </Text>
        <Button onPress={onRefresh} className="px-6 py-3 rounded-xl" style={{ backgroundColor: colors.primary }}>
          <ButtonText className="text-white font-semibold">Try Again</ButtonText>
        </Button>
      </VStack>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View className="border-b pb-2" style={{ backgroundColor: colors.surface, borderBottomColor: colors.border }}>
        <ProductSearch onSearchChange={handleSearchChange} value={searchQuery} />
        <View className="px-4 mt-2">
          <ProductFilter onFilterChange={handleFilterChange} activeFilters={filters} productCount={filteredCount} />
        </View>

        {hasActiveFiltersOrSearch && (
          <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />
        )}

        {hasResults && (
          <ResultsHeader
            isSearching={isSearching}
            filteredCount={filteredCount}
            totalCount={totalCount}
            filters={filters}
            viewMode={viewMode}
            updateViewMode={updateViewMode}
            colors={colors}
          />
        )}
      </View>

      {/* Content */}
      {hasResults ? (
        <FlatList
          data={filteredProducts}
          key={`${viewMode}-${numOfColumns}`} // 🔑 ensures remount
          numColumns={numOfColumns}
          keyExtractor={(item, i) => `${viewMode}-${item.id ?? i}`}
          renderItem={({ item }) => <ProductCard product={item} viewMode={viewMode} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          columnWrapperStyle={numOfColumns > 1 ? { gap: 16 } : undefined}
          ItemSeparatorComponent={() => <View className="h-4" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={6}
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
            paddingBottom: 120,
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        >
          {hasActiveFiltersOrSearch ? (
            <NoResultsState
              searchQuery={filters?.searchQuery || ""}
              onClearSearch={() => handleSearchChange("")}
              onResetFilters={handleClearAllFilters}
              colors={colors}
            />
          ) : (
            <EmptyState onRefresh={onRefresh} colors={colors} />
          )}
        </ScrollView>
      )}
    </View>
  );
}