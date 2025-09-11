import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import { HStack } from './ui/hstack';
import { Text } from './ui/text';
import { Icon } from './ui/icon';
import { StarIcon, TagIcon, TrendingUpIcon, PercentIcon } from 'lucide-react-native';
import { FilterOptions } from './ProductFilter';

interface QuickFiltersProps {
  onQuickFilter: (filterUpdate: Partial<FilterOptions>) => void;
  currentFilters: FilterOptions;
}

interface QuickFilterOption {
  id: string;
  label: string;
  icon: any;
  filterUpdate: Partial<FilterOptions>;
  isActive: (filters: FilterOptions) => boolean;
}

export default function QuickFilters({ onQuickFilter, currentFilters }: QuickFiltersProps) {
  const quickFilterOptions: QuickFilterOption[] = [
    {
      id: 'on-sale',
      label: 'On Sale',
      icon: PercentIcon,
      filterUpdate: { onSale: true },
      isActive: (filters) => filters.onSale === true,
    },
    {
      id: 'high-rated',
      label: '4+ Stars',
      icon: StarIcon,
      filterUpdate: { minRating: 4 },
      isActive: (filters) => filters.minRating >= 4,
    },
    {
      id: 'in-stock',
      label: 'In Stock',
      icon: TagIcon,
      filterUpdate: { inStock: true },
      isActive: (filters) => filters.inStock === true,
    },
    {
      id: 'popular',
      label: 'Popular',
      icon: TrendingUpIcon,
      filterUpdate: { sortBy: 'popularity' },
      isActive: (filters) => filters.sortBy === 'popularity',
    },
  ];

  const handleQuickFilter = (option: QuickFilterOption) => {
    if (option.isActive(currentFilters)) {
      // If filter is active, remove it
      const resetUpdate: Partial<FilterOptions> = {};
      Object.keys(option.filterUpdate).forEach(key => {
        const filterKey = key as keyof FilterOptions;
        switch (filterKey) {
          case 'onSale':
            resetUpdate.onSale = false;
            break;
          case 'minRating':
            resetUpdate.minRating = 0;
            break;
          case 'inStock':
            resetUpdate.inStock = null;
            break;
          case 'sortBy':
            resetUpdate.sortBy = 'name';
            break;
        }
      });
      onQuickFilter(resetUpdate);
    } else {
      // Apply the filter
      onQuickFilter(option.filterUpdate);
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-3 py-2"
      contentContainerStyle={{ paddingRight: 20 }}
    >
      <HStack space="sm">
        {quickFilterOptions.map((option) => {
          const isActive = option.isActive(currentFilters);
          return (
            <Pressable
              key={option.id}
              onPress={() => handleQuickFilter(option)}
              className={`flex-row items-center px-3 py-2 rounded-full border ${
                isActive
                  ? 'bg-primary-500 border-primary-500'
                  : 'bg-background-50 border-outline-300'
              }`}
            >
              <Icon
                as={option.icon}
                size="sm"
                className={`mr-1 ${
                  isActive ? 'text-white' : 'text-typography-600'
                }`}
              />
              <Text
                className={`text-sm ${
                  isActive ? 'text-white' : 'text-typography-700'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </ScrollView>
  );
}