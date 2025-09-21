import React from "react";
import { View, StatusBar } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import {
  ProductsHeader,
  ProductsList,
  ProductsEmptyState,
  ProductsErrorState,
  ProductsLoadingState,
  useProductsLogic,
} from "../components/products/screen";

export default function ProductsScreen() {
  const { colors, isDark } = useTheme();
  
  // Use the custom hook that contains all the logic
  const {
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
    isLoading,
    error,
    
    // Handlers
    onRefresh,
    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearAllFilters,
    updateViewMode,
  } = useProductsLogic();

  // Loading state
  if (isLoading) {
    return <ProductsLoadingState />;
  }

  // Error state
  if (error) {
    return <ProductsErrorState error={error} onRetry={onRefresh} />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header Component */}
      <ProductsHeader
        categoryName={categoryName}
        categoryId={categoryId}
        filters={filters}
        searchQuery={searchQuery}
        filteredCount={filteredCount}
        totalCount={totalCount}
        hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
        hasResults={hasResults}
        isSearching={isSearching}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
        updateViewMode={updateViewMode}
      />

      {/* Content - Products List or Empty State */}
      {hasResults ? (
        <ProductsList
          products={filteredProducts}
          viewMode={viewMode}
          numColumns={numOfColumns}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <ProductsEmptyState
          hasActiveFiltersOrSearch={hasActiveFiltersOrSearch}
          searchQuery={searchQuery}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onClearSearch={() => handleSearchChange("")}
          onResetFilters={handleClearAllFilters}
        />
      )}
    </View>
  );
}