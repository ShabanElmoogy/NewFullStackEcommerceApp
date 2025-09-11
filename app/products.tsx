import { 
  ActivityIndicator, 
  FlatList, 
  View, 
  ScrollView, 
  RefreshControl, 
  StatusBar,
  Platform,
  Pressable
} from 'react-native';
import ProductItem from '../components/ProductListItem';
import ProductFilter, { FilterOptions } from '../components/ProductFilter';
import ProductSearch from '../components/ProductSearch';
import ActiveFilters from '../components/ActiveFilters';
import React, { useState, useCallback, useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { HStack } from '../components/ui/hstack';
import { Badge, BadgeText } from '../components/ui/badge';
import { Button, ButtonText } from '../components/ui/button';
import { useNumColumns } from '@/hooks/useNumColumns';
import { 
  SearchIcon, 
  FilterIcon, 
  RefreshCwIcon, 
  ShoppingBagIcon, 
  SlidersHorizontalIcon,
  XIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  SparklesIcon,
  ArrowUpIcon,
  GridIcon,
  ListIcon
} from 'lucide-react-native';

export default function ProductsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use persistent filters
  const { 
    filters, 
    isLoaded: filtersLoaded, 
    updateFilters, 
    updatePartialFilters, 
    clearSavedFilters,
    defaultFilters 
  } = useFilterPersistence();

  // Compute columns based on window width
  const numOfColumns = useNumColumns();

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

  const handleSearchChange = useCallback((searchQuery: string) => {
    updatePartialFilters({ searchQuery });
  }, [updatePartialFilters]);

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
  if (isLoading || !filtersLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircleIcon color="#EF4444" size={48} />
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Button onPress={onRefresh} style={styles.retryButton}>
          <ButtonText style={styles.retryButtonText}>Try Again</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Search Bar */}
        <ProductSearch
          onSearchChange={handleSearchChange}
          value={filters?.searchQuery || ''}
        />

        {/* Filter Row */}
        <View style={styles.filterRow}>
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
          <View style={styles.resultsSummary}>
            <View style={styles.resultsLeft}>
              <Text style={styles.resultsText}>
                {isSearching 
                  ? `${filteredCount} results for "${filters?.searchQuery || ''}"`
                  : `${filteredCount} of ${totalCount} products`
                }
              </Text>
              {filteredCount !== totalCount && (
                <Badge style={styles.filteredBadge}>
                  <BadgeText style={styles.filteredBadgeText}>Filtered</BadgeText>
                </Badge>
              )}
            </View>
            
            <View style={styles.viewToggle}>
              <Pressable
                onPress={() => setViewMode('grid')}
                style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
              >
                <GridIcon 
                  size={18} 
                  color={viewMode === 'grid' ? '#3B82F6' : '#64748B'} 
                />
              </Pressable>
              <Pressable
                onPress={() => setViewMode('list')}
                style={[styles.viewButton, viewMode === 'list' && styles.viewButtonActive]}
              >
                <ListIcon 
                  size={18} 
                  color={viewMode === 'list' ? '#3B82F6' : '#64748B'} 
                />
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* Content Section */}
      {hasResults ? (
        <FlatList
          data={filteredProducts}
          key={`${numOfColumns}-${viewMode}`}
          numColumns={viewMode === 'grid' ? numOfColumns : 1}
          style={styles.productsList}
          contentContainerStyle={styles.productsListContent}
          columnWrapperStyle={viewMode === 'grid' && numOfColumns > 1 ? styles.columnWrapper : undefined}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
              <ProductItem product={item} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      ) : (
        <ScrollView 
          style={styles.emptyStateContainer}
          contentContainerStyle={styles.emptyStateContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
        >
          {hasActiveFiltersOrSearch ? (
            <NoResultsState 
              searchQuery={filters?.searchQuery || ''}
              onClearSearch={() => handleSearchChange('')}
              onResetFilters={handleClearAllFilters}
            />
          ) : (
            <EmptyState onRefresh={onRefresh} />
          )}
        </ScrollView>
      )}
    </View>
  );
}

// No Results Component
const NoResultsState = ({ 
  searchQuery, 
  onClearSearch, 
  onResetFilters 
}: {
  searchQuery: string;
  onClearSearch: () => void;
  onResetFilters: () => void;
}) => (
  <View style={styles.noResultsContainer}>
    <View style={styles.noResultsIllustration}>
      <View style={styles.noResultsIconContainer}>
        <SearchIcon color="#3B82F6" size={40} />
      </View>
    </View>

    <Text style={styles.noResultsTitle}>No results found</Text>
    <Text style={styles.noResultsMessage}>
      {searchQuery.trim() 
        ? `We couldn't find anything matching "${searchQuery}"`
        : "No products match your current filters"
      }
    </Text>

    <View style={styles.noResultsActions}>
      {searchQuery.trim() && (
        <Button onPress={onClearSearch} style={styles.secondaryButton}>
          <HStack style={styles.buttonContent}>
            <XIcon color="#475569" size={18} />
            <ButtonText style={styles.secondaryButtonText}>Clear search</ButtonText>
          </HStack>
        </Button>
      )}
      
      <Button onPress={onResetFilters} style={styles.primaryButton}>
        <HStack style={styles.buttonContent}>
          <RefreshCwIcon color="#FFFFFF" size={18} />
          <ButtonText style={styles.primaryButtonText}>Reset filters</ButtonText>
        </HStack>
      </Button>
    </View>

    <View style={styles.suggestionsCard}>
      <HStack style={styles.suggestionsHeader}>
        <SparklesIcon color="#3B82F6" size={20} />
        <Text style={styles.suggestionsTitle}>Try these suggestions</Text>
      </HStack>
      
      {[
        'Check your spelling',
        'Use more general keywords', 
        'Try different search terms',
        'Remove some filters'
      ].map((suggestion, index) => (
        <HStack key={index} style={styles.suggestionItem}>
          <View style={styles.suggestionBullet} />
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </HStack>
      ))}
    </View>
  </View>
);

// Empty State Component
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <View style={styles.emptyStateInner}>
    <View style={styles.emptyStateIllustration}>
      <View style={styles.emptyStateIconContainer}>
        <ShoppingBagIcon color="#F59E0B" size={40} />
      </View>
    </View>

    <Text style={styles.emptyStateTitle}>Coming soon</Text>
    <Text style={styles.emptyStateMessage}>
      We're working hard to bring you amazing products. Check back soon!
    </Text>

    <Button onPress={onRefresh} style={styles.primaryButton}>
      <HStack style={styles.buttonContent}>
        <RefreshCwIcon color="#FFFFFF" size={20} />
        <ButtonText style={styles.primaryButtonText}>Refresh</ButtonText>
      </HStack>
    </Button>
  </View>
);

// Styles
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  resultsLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
    gap: 8,
  },
  viewToggle: {
    flexDirection: 'row' as const,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultsSummary: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultsText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500' as const,
  },
  filteredBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  filteredBadgeText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  productsList: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  productsListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    gap: 16,
  },
  itemSeparator: {
    height: 16,
  },
  gridItem: {
    flex: 1,
  },
  listItem: {
    width: '100%' as const,
  },
  emptyStateContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyStateContent: {
    flexGrow: 1,
    justifyContent: 'center' as const,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  noResultsContainer: {
    alignItems: 'center' as const,
    maxWidth: 360,
    alignSelf: 'center' as const,
    width: '100%',
  },
  noResultsIllustration: {
    width: 120,
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 60,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noResultsIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#EFF6FF',
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#0F172A',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  noResultsMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 24,
  },
  noResultsActions: {
    flexDirection: 'row' as const,
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600' as const,
    fontSize: 15,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0,
  },
  secondaryButtonText: {
    color: '#475569',
    fontWeight: '600' as const,
    fontSize: 15,
  },
  buttonContent: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
  suggestionsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionsHeader: {
    alignItems: 'center' as const,
    marginBottom: 16,
    gap: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#0F172A',
  },
  suggestionItem: {
    alignItems: 'center' as const,
    marginBottom: 8,
    gap: 12,
  },
  suggestionBullet: {
    width: 6,
    height: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  suggestionText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 22,
  },
  emptyStateInner: {
    alignItems: 'center' as const,
    maxWidth: 320,
    alignSelf: 'center' as const,
    width: '100%',
  },
  emptyStateIllustration: {
    width: 120,
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 60,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#FEF3C7',
    borderRadius: 32,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#0F172A',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center' as const,
    lineHeight: 24,
    marginBottom: 24,
  },
};