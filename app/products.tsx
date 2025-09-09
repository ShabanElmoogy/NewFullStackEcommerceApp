import { ActivityIndicator, FlatList, View } from 'react-native';
import ProductItem from '../components/ProductListItem';
import ProductFilter, { FilterOptions } from '../components/ProductFilter';
import ActiveFilters from '../components/ActiveFilters';
import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilter } from '@/hooks/useProductFilter';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { HStack } from '../components/ui/hstack';
import { Badge, BadgeText } from '../components/ui/badge';
import { useNumColumns } from '@/hooks/useNumColumns';

export default function ProductsScreen() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    sortBy: 'name',
    minPrice: '',
    maxPrice: '',
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Compute columns based on window width (avoids useInsertionEffect in some libraries)
  const numOfColumns = useNumColumns();

  const { data, isLoading, error } = useProducts();

  // Handle case where data might be an object with products array or direct array
  const products = Array.isArray(data) ? data : (data && data.products ? data.products : []);

  const { filteredProducts, totalCount, filteredCount } = useProductFilter(products, filters);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const toggleFilterExpanded = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center text-red-500">{error.message}</Text>
      </View>
    );
  }

  return (
    <VStack className="flex-1">
      {/* Filter Component */}
      <ProductFilter
        onFilterChange={handleFilterChange}
        isExpanded={isFilterExpanded}
        onToggleExpanded={toggleFilterExpanded}
      />

      {/* Results Summary */}
      <HStack className="px-3 pb-2 justify-between items-center">
        <Text className="text-sm text-typography-600">
          Showing {filteredCount} of {totalCount} products
        </Text>
        {filteredCount !== totalCount && (
          <Badge variant="outline" size="sm">
            <BadgeText>Filtered</BadgeText>
          </Badge>
        )}
      </HStack>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Text className="text-center text-typography-500 text-lg">
            No products found matching your criteria
          </Text>
          <Text className="text-center text-typography-400 text-sm mt-2">
            Try adjusting your filters or search terms
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          key={numOfColumns}
          numColumns={numOfColumns}
          contentContainerClassName='gap-2 max-w-[960px] mx-auto w-full p-3'
          columnWrapperClassName='gap-2'
          renderItem={({ item }) => (
            <ProductItem product={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  );
}