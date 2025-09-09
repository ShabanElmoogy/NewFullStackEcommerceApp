import React from 'react';
import { HStack } from './ui/hstack';
import { Badge, BadgeText } from './ui/badge';
import { Button, ButtonText } from './ui/button';
import { Icon } from './ui/icon';
import { XIcon } from 'lucide-react-native';
import { FilterOptions } from './ProductFilter';
import { ScrollView } from 'react-native';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters = [];

  // Check for active filters
  if (filters.searchQuery) {
    activeFilters.push({
      key: 'searchQuery' as keyof FilterOptions,
      label: `Search: "${filters.searchQuery}"`,
      value: filters.searchQuery
    });
  }

  if (filters.sortBy !== 'name') {
    const sortLabels = {
      'price-low': 'Price: Low to High',
      'price-high': 'Price: High to Low',
      'newest': 'Newest First'
    };
    activeFilters.push({
      key: 'sortBy' as keyof FilterOptions,
      label: sortLabels[filters.sortBy] || filters.sortBy,
      value: filters.sortBy
    });
  }

  if (filters.minPrice) {
    activeFilters.push({
      key: 'minPrice' as keyof FilterOptions,
      label: `Min: $${filters.minPrice}`,
      value: filters.minPrice
    });
  }

  if (filters.maxPrice) {
    activeFilters.push({
      key: 'maxPrice' as keyof FilterOptions,
      label: `Max: $${filters.maxPrice}`,
      value: filters.maxPrice
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-3 pb-2"
      contentContainerStyle={{ paddingRight: 20 }}
    >
      <HStack space="sm" className="items-center">
        {activeFilters.map((filter, index) => (
          <Badge key={index} variant="solid" size="sm" className="bg-primary-500">
            <BadgeText className="text-white mr-1">{filter.label}</BadgeText>
            <Button
              size="xs"
              variant="link"
              onPress={() => onRemoveFilter(filter.key)}
              className="p-0 h-4 w-4 ml-1"
            >
              <Icon as={XIcon} size="xs" className="text-white" />
            </Button>
          </Badge>
        ))}
        
        {activeFilters.length > 1 && (
          <Button
            size="sm"
            variant="outline"
            onPress={onClearAll}
            className="ml-2"
          >
            <ButtonText className="text-xs">Clear All</ButtonText>
          </Button>
        )}
      </HStack>
    </ScrollView>
  );
}