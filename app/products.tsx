import { 
  ActivityIndicator, 
  FlatList, 
  View, 
  ScrollView, 
  RefreshControl, 
  StatusBar,
  Pressable,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import ProductFilter, { FilterOptions } from '../components/ProductFilter';
import ProductSearch from '../components/ProductSearch';
import ActiveFilters from '../components/ActiveFilters';
import CompareFloatingBar from '../components/CompareFloatingBar';
import React, { useState, useCallback, useMemo } from 'react';
import { useSearchStore } from '../store/searchStore';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';
import { useViewModePersistence } from '@/hooks/useViewModePersistence';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '../components/ui/text';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Badge, BadgeText } from '../components/ui/badge';
import { Button, ButtonText } from '../components/ui/button';
import { useNumColumns } from '@/hooks/useNumColumns';
import { 
  SearchIcon, 
  RefreshCwIcon, 
  ShoppingBagIcon, 
  XIcon,
  AlertCircleIcon,
  SparklesIcon,
  GridIcon,
  ListIcon
} from 'lucide-react-native';

export default function ProductsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  // Use persistent filters
  const {
    filters,
    isLoaded: filtersLoaded,
    updateFilters,
    updatePartialFilters,
    defaultFilters
  } = useFilterPersistence();

  // Zustand search store
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const clearSearchQuery = useSearchStore((state) => state.clearSearchQuery);

  // Sync Zustand searchQuery to filters.searchQuery
  React.useEffect(() => {
    if (filters && filters.searchQuery !== searchQuery) {
      updatePartialFilters({ searchQuery });
    }
  }, [searchQuery, filters, updatePartialFilters]);

  // Use persistent view mode
  const {
    viewMode,
    isLoaded: viewModeLoaded,
    updateViewMode
  } = useViewModePersistence();

  // Compute columns based on window width and view mode
  const baseNumColumns = useNumColumns();
  const numOfColumns = viewMode === 'list' ? 1 : baseNumColumns;

  const { data, isLoading, error, refetch } = useProducts();

  // Handle case where data might be an object with products array or direct array
  const products = Array.isArray(data) ? data : (data && data.products ? data.products : []);

  const { filteredProducts, totalCount, filteredCount } = useProductFilter(products, filters);

  // Memoized handlers for performance
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    updateFilters(newFilters);
  }, [updateFilters]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    updatePartialFilters({ searchQuery: query });
    if (!query || query.trim() === '') {
      clearSearchQuery();
    }
  }, [setSearchQuery, updatePartialFilters, clearSearchQuery]);

  const handleRemoveFilter = useCallback((key: keyof FilterOptions) => {
    const resetValue: Partial<FilterOptions> = {};
    
    switch (key) {
      case 'searchQuery':
        resetValue.searchQuery = '';
        break;
      case 'sortBy':
        resetValue.sortBy = 'name';
        break;
      case 'minPrice':
        resetValue.minPrice = '';
        break;
      case 'maxPrice':
        resetValue.maxPrice = '';
        break;
      case 'categories':
        resetValue.categories = [];
        break;
      case 'brands':
        resetValue.brands = [];
        break;
      case 'minRating':
        resetValue.minRating = 0;
        break;
      case 'inStock':
        resetValue.inStock = null;
        break;
      case 'onSale':
        resetValue.onSale = false;
        break;
      default:
        return;
    }
    
    updatePartialFilters(resetValue);
  }, [updatePartialFilters]);

  const handleClearAllFilters = useCallback(() => {
    updateFilters(defaultFilters);
  }, [updateFilters, defaultFilters]);

  // Memoized computed values
  const hasActiveFiltersOrSearch = useMemo(() => {
    if (!filters) return false;
    
    return (filters.searchQuery && filters.searchQuery.trim() !== '') ||
           (filters.sortBy && filters.sortBy !== 'name') ||
           (filters.minPrice && filters.minPrice !== '') ||
           (filters.maxPrice && filters.maxPrice !== '') ||
           (filters.categories && filters.categories.length > 0) ||
           (filters.brands && filters.brands.length > 0) ||
           (filters.minRating && filters.minRating > 0) ||
           (filters.inStock !== null) ||
           (filters.onSale === true);
  }, [filters]);

  const hasResults = filteredProducts.length > 0;
  const isSearching = filters && filters.searchQuery && filters.searchQuery.trim() !== '';

  // Loading state
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

  // Error state
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
        <Button 
          onPress={onRefresh} 
          className="px-6 py-3 rounded-xl"
          style={{ backgroundColor: colors.primary }}
        >
          <ButtonText className="text-white font-semibold">Try Again</ButtonText>
        </Button>
      </VStack>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} 
                 backgroundColor={colors.background} />
      
      {/* Header Section */}
      <View 
        className="border-b pb-2" 
        style={{ backgroundColor: colors.surface, borderBottomColor: colors.border }}
      >
        {/* Search Bar */}
        <ProductSearch
          onSearchChange={handleSearchChange}
          value={searchQuery}
        />

        {/* Filter Row */}
        <View className="px-4 mt-2">
          <ProductFilter
            onFilterChange={handleFilterChange}
            activeFilters={filters}
            productCount={filteredCount}
          />
        </View>

        {/* Active Filters */}
        {hasActiveFiltersOrSearch && (
          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        )}

        {/* Results Summary & View Toggle */}
        {hasResults && (
          <HStack className="justify-between items-center px-4 pt-3">
            <HStack className="items-center flex-1 gap-2">
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                {isSearching 
                  ? `${filteredCount} results for "${filters?.searchQuery || ''}"`
                  : `${filteredCount} of ${totalCount} products`
                }
              </Text>
              {filteredCount !== totalCount && (
                <Badge 
                  className="border"
                  style={{ 
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary + '40'
                  }}
                >
                  <BadgeText className="text-xs font-semibold" style={{ color: colors.primary }}>
                    Filtered
                  </BadgeText>
                </Badge>
              )}
            </HStack>
            
            <View 
              className="rounded-xl p-1 mt-2 border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <HStack className="gap-1">
                <Pressable
                  onPress={() => updateViewMode('grid')}
                  className={`px-4 py-2.5 rounded-lg flex-row items-center gap-2 ${
                    viewMode === 'grid' ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: viewMode === 'grid' ? colors.primary : 'transparent',
                    ...(viewMode === 'grid' && {
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 2,
                    })
                  }}
                >
                  <GridIcon 
                    size={16} 
                    color={viewMode === 'grid' ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text 
                    className={`text-sm font-medium ${viewMode === 'grid' ? 'text-white' : ''}`}
                    style={{ color: viewMode === 'grid' ? '#FFFFFF' : colors.textSecondary }}
                  >
                    Grid
                  </Text>
                </Pressable>
                
                <Pressable
                  onPress={() => updateViewMode('list')}
                  className={`px-4 py-2.5 rounded-lg flex-row items-center gap-2 ${
                    viewMode === 'list' ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: viewMode === 'list' ? colors.primary : 'transparent',
                    ...(viewMode === 'list' && {
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 2,
                    })
                  }}
                >
                  <ListIcon 
                    size={16} 
                    color={viewMode === 'list' ? '#FFFFFF' : colors.textSecondary} 
                  />
                  <Text 
                    className={`text-sm font-medium ${viewMode === 'list' ? 'text-white' : ''}`}
                    style={{ color: viewMode === 'list' ? '#FFFFFF' : colors.textSecondary }}
                  >
                    List
                  </Text>
                </Pressable>
              </HStack>
            </View>
          </HStack>
        )}
      </View>

      {/* Content Section */}
      {hasResults ? (
        <FlatList
          data={filteredProducts}
          key={`${viewMode}-${baseNumColumns}`}
          numColumns={numOfColumns}
          className="flex-1"
          style={{ backgroundColor: colors.backgroundSecondary }}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          columnWrapperStyle={numOfColumns > 1 ? { gap: 16 } : null}
          ItemSeparatorComponent={() => <View className="h-4" />}
          renderItem={({ item }) => (
            <ProductCard product={item} viewMode={viewMode} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={6}
        />
      ) : (
        <ScrollView 
          className="flex-1"
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40, paddingBottom: 120 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {hasActiveFiltersOrSearch ? (
            <NoResultsState 
              searchQuery={filters?.searchQuery || ''}
              onClearSearch={() => handleSearchChange('')}
              onResetFilters={handleClearAllFilters}
              colors={colors}
            />
          ) : (
            <EmptyState onRefresh={onRefresh} colors={colors} />
          )}
        </ScrollView>
      )}

      {/* Compare Floating Bar */}
      <CompareFloatingBar />
    </View>
  );
}

// No Results Component
const NoResultsState = ({ 
  searchQuery, 
  onClearSearch, 
  onResetFilters,
  colors 
}: {
  searchQuery: string;
  onClearSearch: () => void;
  onResetFilters: () => void;
  colors: any;
}) => (
  <VStack className="items-center max-w-sm self-center">
    <View 
      className="w-30 h-30 rounded-full items-center justify-center mb-6 border"
      style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
    >
      <View 
        className="w-16 h-16 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.primary + '20' }}
      >
        <SearchIcon color={colors.primary} size={40} />
      </View>
    </View>

    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      No results found
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      {searchQuery.trim() 
        ? `We couldn't find anything matching "${searchQuery}"`
        : "No products match your current filters"
      }
    </Text>

    <HStack className="gap-3 mb-6">
      {searchQuery.trim() && (
        <Button 
          onPress={onClearSearch} 
          className="flex-1 py-3.5 rounded-xl border"
          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
        >
          <HStack className="items-center justify-center gap-2">
            <XIcon color={colors.textSecondary} size={18} />
            <ButtonText className="font-semibold" style={{ color: colors.textSecondary }}>
              Clear search
            </ButtonText>
          </HStack>
        </Button>
      )}
      
      <Button 
        onPress={onResetFilters} 
        className="flex-1 py-3.5 rounded-xl"
        style={{ backgroundColor: colors.primary }}
      >
        <HStack className="items-center justify-center gap-2">
          <RefreshCwIcon color="#FFFFFF" size={18} />
          <ButtonText className="text-white font-semibold">Reset filters</ButtonText>
        </HStack>
      </Button>
    </HStack>

    <View 
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <HStack className="items-center mb-4 gap-2">
        <SparklesIcon color={colors.primary} size={20} />
        <Text className="text-base font-semibold" style={{ color: colors.text }}>
          Try these suggestions
        </Text>
      </HStack>
      
      {[
        'Check your spelling',
        'Use more general keywords', 
        'Try different search terms',
        'Remove some filters'
      ].map((suggestion, index) => (
        <HStack key={index} className="items-center mb-2 gap-3">
          <View 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
          <Text className="text-sm flex-1" style={{ color: colors.textSecondary }}>
            {suggestion}
          </Text>
        </HStack>
      ))}
    </View>
  </VStack>
);

// Empty State Component
const EmptyState = ({ onRefresh, colors }: { onRefresh: () => void; colors: any }) => (
  <VStack className="items-center max-w-xs self-center">
    <View 
      className="w-30 h-30 rounded-full items-center justify-center mb-6 border"
      style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
    >
      <View 
        className="w-16 h-16 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.warning + '20' }}
      >
        <ShoppingBagIcon color={colors.warning} size={40} />
      </View>
    </View>

    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      Coming soon
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      We're working hard to bring you amazing products. Check back soon!
    </Text>

    <Button 
      onPress={onRefresh} 
      className="py-3.5 px-6 rounded-xl"
      style={{ backgroundColor: colors.primary }}
    >
      <HStack className="items-center justify-center gap-2">
        <RefreshCwIcon color="#FFFFFF" size={20} />
        <ButtonText className="text-white font-semibold">Refresh</ButtonText>
      </HStack>
    </Button>
  </VStack>
);