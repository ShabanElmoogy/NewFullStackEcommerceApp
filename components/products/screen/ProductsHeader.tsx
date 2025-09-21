import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import ProductSearch from '../productCard/ProductSearch';
import ProductFilter, { FilterOptions } from '../productsFilter/ProductFilter';
import ActiveFilters from '../productsFilter/ActiveFilters';
import ResultsHeader from '../productsFilter/ResultsHeader';

interface ProductsHeaderProps {
  categoryName?: string;
  categoryId?: string;
  filters?: FilterOptions;
  searchQuery: string;
  filteredCount: number;
  totalCount: number;
  hasActiveFiltersOrSearch: boolean;
  hasResults: boolean;
  isSearching: boolean;
  viewMode: 'grid' | 'list';
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onRemoveFilter: (key: keyof FilterOptions) => void;
  onClearAllFilters: () => void;
  updateViewMode: (mode: 'grid' | 'list') => void;
}

export default function ProductsHeader({
  categoryName,
  categoryId,
  filters,
  searchQuery,
  filteredCount,
  totalCount,
  hasActiveFiltersOrSearch,
  hasResults,
  isSearching,
  viewMode,
  onSearchChange,
  onFilterChange,
  onRemoveFilter,
  onClearAllFilters,
  updateViewMode,
}: ProductsHeaderProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="border-b pb-2" style={{ backgroundColor: colors.surface, borderBottomColor: colors.border }}>
      {/* Category Header - Show when coming from category selection AND category is still filtered */}
      {categoryName && categoryId && filters?.categories?.includes(categoryId) && (
        <View className="px-4 pt-2 pb-1">
          <Text 
            className="text-lg font-bold text-center"
            style={{ color: colors.text }}
          >
            {decodeURIComponent(categoryName)}
          </Text>
          <Text 
            className="text-sm text-center mt-0.5"
            style={{ color: colors.textSecondary }}
          >
            {t('products.browseCategory')}
          </Text>
        </View>
      )}
      
      <ProductSearch onSearchChange={onSearchChange} value={searchQuery} />
      <View className="px-4 mt-2">
        <ProductFilter onFilterChange={onFilterChange} activeFilters={filters} productCount={filteredCount} />
      </View>

      {hasActiveFiltersOrSearch && (
        <ActiveFilters filters={filters} onRemoveFilter={onRemoveFilter} onClearAll={onClearAllFilters} />
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
  );
}