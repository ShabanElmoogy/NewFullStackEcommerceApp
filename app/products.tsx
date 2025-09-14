import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  ScrollView,
  RefreshControl,
  StatusBar,
  Pressable,
} from "react-native";
import {
  SearchIcon,
  RefreshCwIcon,
  ShoppingBagIcon,
  XIcon,
  AlertCircleIcon,
  SparklesIcon,
  GridIcon,
  ListIcon,
} from "lucide-react-native";

import ProductCard from "../components/ProductCard";
import ProductFilter, { FilterOptions } from "../components/ProductFilter";
import ProductSearch from "../components/ProductSearch";
import ActiveFilters from "../components/ActiveFilters";
import CompareFloatingBar from "../components/CompareFloatingBar";
import { useSearchStore } from "../store/searchStore";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilter } from "@/hooks/useProductFilter";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";
import { useViewModePersistence } from "@/hooks/useViewModePersistence";
import { useTheme } from "@/hooks/useTheme";
import { useNumColumns } from "@/hooks/useNumColumns";
import { Text } from "../components/ui/text";
import { HStack } from "../components/ui/hstack";
import { VStack } from "../components/ui/vstack";
import { Badge, BadgeText } from "../components/ui/badge";
import { Button, ButtonText } from "../components/ui/button";

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
    },
    [updatePartialFilters]
  );

  const handleClearAllFilters = useCallback(() => updateFilters(defaultFilters), [updateFilters, defaultFilters]);

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

      <CompareFloatingBar />
    </View>
  );
}

/* ----------------- Header Row ----------------- */
const ResultsHeader = ({ isSearching, filteredCount, totalCount, filters, viewMode, updateViewMode, colors }: any) => (
  <HStack className="justify-between items-center px-4 pt-3">
    <HStack className="items-center flex-1 gap-2">
      <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
        {isSearching ? `${filteredCount} results for "${filters?.searchQuery}"` : `${filteredCount} of ${totalCount} products`}
      </Text>
      {filteredCount !== totalCount && (
        <Badge className="border" style={{ backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }}>
          <BadgeText className="text-xs font-semibold" style={{ color: colors.primary }}>
            Filtered
          </BadgeText>
        </Badge>
      )}
    </HStack>

    <View className="rounded-xl p-1 mt-2 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
      <HStack className="gap-1">
        {["grid", "list"].map((mode) => {
          const Icon = mode === "grid" ? GridIcon : ListIcon;
          const active = viewMode === mode;
          return (
            <Pressable
              key={mode}
              onPress={() => updateViewMode(mode)}
              className="px-4 py-2.5 rounded-lg flex-row items-center gap-2"
              style={{ backgroundColor: active ? colors.primary : "transparent" }}
            >
              <Icon size={16} color={active ? "#fff" : colors.textSecondary} />
              <Text className="text-sm font-medium" style={{ color: active ? "#fff" : colors.textSecondary }}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </View>
  </HStack>
);

/* ----------------- No Results ----------------- */
const NoResultsState = ({ searchQuery, onClearSearch, onResetFilters, colors }: any) => (
  <VStack className="items-center max-w-sm self-center">
    <CircleIcon colors={colors} icon={<SearchIcon color={colors.primary} size={40} />} tint={colors.primary + "20"} />
    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      No results found
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      {searchQuery.trim() ? `We couldn't find anything matching "${searchQuery}"` : "No products match your filters"}
    </Text>

    <HStack className="gap-3 mb-6">
      {searchQuery.trim() && (
        <Button onPress={onClearSearch} className="flex-1 py-3.5 rounded-xl border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
          <HStack className="items-center justify-center gap-2">
            <XIcon color={colors.textSecondary} size={18} />
            <ButtonText className="font-semibold" style={{ color: colors.textSecondary }}>
              Clear search
            </ButtonText>
          </HStack>
        </Button>
      )}
      <Button onPress={onResetFilters} className="flex-1 py-3.5 rounded-xl" style={{ backgroundColor: colors.primary }}>
        <HStack className="items-center justify-center gap-2">
          <RefreshCwIcon color="#fff" size={18} />
          <ButtonText className="text-white font-semibold">Reset filters</ButtonText>
        </HStack>
      </Button>
    </HStack>

    <SuggestionBox colors={colors} />
  </VStack>
);

/* ----------------- Empty State ----------------- */
const EmptyState = ({ onRefresh, colors }: any) => (
  <VStack className="items-center max-w-xs self-center">
    <CircleIcon colors={colors} icon={<ShoppingBagIcon color={colors.warning} size={40} />} tint={colors.warning + "20"} />
    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      Coming soon
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      We're working hard to bring you amazing products. Check back soon!
    </Text>
    <Button onPress={onRefresh} className="py-3.5 px-6 rounded-xl" style={{ backgroundColor: colors.primary }}>
      <HStack className="items-center justify-center gap-2">
        <RefreshCwIcon color="#fff" size={20} />
        <ButtonText className="text-white font-semibold">Refresh</ButtonText>
      </HStack>
    </Button>
  </VStack>
);

/* ----------------- Helpers ----------------- */
const CircleIcon = ({ colors, icon, tint }: any) => (
  <View className="w-30 h-30 rounded-full items-center justify-center mb-6 border" style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}>
    <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: tint }}>
      {icon}
    </View>
  </View>
);

const SuggestionBox = ({ colors }: any) => (
  <View className="rounded-2xl p-5 border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
    <HStack className="items-center mb-4 gap-2">
      <SparklesIcon color={colors.primary} size={20} />
      <Text className="text-base font-semibold" style={{ color: colors.text }}>
        Try these suggestions
      </Text>
    </HStack>
    {["Check your spelling", "Use more general keywords", "Try different terms", "Remove some filters"].map((s, i) => (
      <HStack key={i} className="items-center mb-2 gap-3">
        <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <Text className="text-sm flex-1" style={{ color: colors.textSecondary }}>
          {s}
        </Text>
      </HStack>
    ))}
  </View>
);
