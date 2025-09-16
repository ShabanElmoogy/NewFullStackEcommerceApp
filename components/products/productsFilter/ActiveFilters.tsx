import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { HStack } from '../../ui/hstack';
import { Text } from '../../ui/text';
import { X } from 'lucide-react-native';
import { FilterOptions } from './ProductFilter';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions) => void;
  onClearAll: () => void;
}

interface ActiveFilter {
  key: keyof FilterOptions;
  label: string;
  value: any;
}

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  if (!filters) return null;

  const activeFilters: ActiveFilter[] = [];

  // Build active filters array
  if (filters.searchQuery && filters.searchQuery.trim()) {
    activeFilters.push({
      key: 'searchQuery',
      label: `Search: "${filters.searchQuery}"`,
      value: filters.searchQuery
    });
  }

  if (filters.sortBy && filters.sortBy !== 'name') {
    const sortLabels: Record<string, string> = {
      'price-low': 'Price: Low to High',
      'price-high': 'Price: High to Low',
      'newest': 'Newest First',
      'rating': 'Highest Rated',
      'popularity': 'Most Popular'
    };
    activeFilters.push({
      key: 'sortBy',
      label: sortLabels[filters.sortBy] || filters.sortBy,
      value: filters.sortBy
    });
  }

  if (filters.categories && filters.categories.length > 0) {
    activeFilters.push({
      key: 'categories',
      label: `Categories: ${filters.categories.join(', ')}`,
      value: filters.categories
    });
  }

  if (filters.brands && filters.brands.length > 0) {
    activeFilters.push({
      key: 'brands',
      label: `Brands: ${filters.brands.join(', ')}`,
      value: filters.brands
    });
  }

  if (filters.minRating && filters.minRating > 0) {
    activeFilters.push({
      key: 'minRating',
      label: `Rating: ${filters.minRating}+ stars`,
      value: filters.minRating
    });
  }

  if (filters.inStock !== null) {
    const stockLabel = filters.inStock ? 'In Stock Only' : 'Out of Stock Only';
    activeFilters.push({
      key: 'inStock',
      label: stockLabel,
      value: filters.inStock
    });
  }

  if (filters.onSale) {
    activeFilters.push({
      key: 'onSale',
      label: 'On Sale',
      value: filters.onSale
    });
  }

  if (filters.minPrice && filters.minPrice.trim()) {
    activeFilters.push({
      key: 'minPrice',
      label: `Min: $${filters.minPrice}`,
      value: filters.minPrice
    });
  }

  if (filters.maxPrice && filters.maxPrice.trim()) {
    activeFilters.push({
      key: 'maxPrice',
      label: `Max: $${filters.maxPrice}`,
      value: filters.maxPrice
    });
  }

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingVertical: 8 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          paddingRight: 32,
        }}
      >
        <HStack space="sm" className="items-center">
          {/* Active Filter Badges */}
          {activeFilters.map((filter, index) => (
            <View
              key={`${filter.key}-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#3B82F6',
                borderRadius: 16,
                paddingLeft: 12,
                paddingRight: 4,
                paddingVertical: 6,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '600',
                  marginRight: 6,
                }}
              >
                {filter.label}
              </Text>
              <Pressable
                onPress={() => {
                  console.log('Removing filter:', filter.key);
                  onRemoveFilter(filter.key);
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <X size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}
          
          {/* Clear All Button */}
          {activeFilters.length > 1 && (
            <Pressable
              onPress={() => {
                console.log('Clearing all filters');
                onClearAll();
              }}
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text
                style={{
                  color: '#374151',
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                Clear All
              </Text>
            </Pressable>
          )}
        </HStack>
      </ScrollView>
    </View>
  );
}