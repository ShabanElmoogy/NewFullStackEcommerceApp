import React from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import NoResultsState from '../productsFilter/NoResultsState';
import EmptyState from '../productsFilter/EmptyState';
import { useTheme } from '@/hooks/useTheme';

interface ProductsEmptyStateProps {
  hasActiveFiltersOrSearch: boolean;
  searchQuery: string;
  refreshing: boolean;
  onRefresh: () => void;
  onClearSearch: () => void;
  onResetFilters: () => void;
}

export default function ProductsEmptyState({
  hasActiveFiltersOrSearch,
  searchQuery,
  refreshing,
  onRefresh,
  onClearSearch,
  onResetFilters,
}: ProductsEmptyStateProps) {
  const { colors } = useTheme();

  return (
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
      <View className="flex-1 justify-center items-center px-6 py-10">
        {hasActiveFiltersOrSearch ? (
          <NoResultsState
            searchQuery={searchQuery}
            onClearSearch={onClearSearch}
            onResetFilters={onResetFilters}
            colors={colors}
          />
        ) : (
          <EmptyState onRefresh={onRefresh} colors={colors} />
        )}
      </View>
    </ScrollView>
  );
}