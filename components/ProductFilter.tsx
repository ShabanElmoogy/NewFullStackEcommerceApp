import React, { useState, useEffect } from 'react';
import { VStack } from './ui/vstack';
import { HStack } from './ui/hstack';
import { Text } from './ui/text';
import { Input, InputField } from './ui/input';
import { Button, ButtonText } from './ui/button';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from './ui/select';
import { ChevronDownIcon, SearchIcon, FilterIcon, XIcon } from 'lucide-react-native';
import { Icon } from './ui/icon';
import { Pressable, Animated } from 'react-native';
import { Card } from './ui/card';
import { Badge, BadgeText } from './ui/badge';

export interface FilterOptions {
  searchQuery: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest';
  minPrice: string;
  maxPrice: string;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export default function ProductFilter({ onFilterChange, isExpanded, onToggleExpanded }: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    sortBy: 'name',
    minPrice: '',
    maxPrice: '',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchQuery: '',
      sortBy: 'name',
      minPrice: '',
      maxPrice: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Card className="m-3 p-4">
      <VStack space="md">
        {/* Filter Header */}
        <Pressable onPress={onToggleExpanded}>
          <HStack className="justify-between items-center">
            <HStack className="items-center" space="sm">
              <Icon as={FilterIcon} size="sm" className="text-typography-600" />
              <Text className="font-semibold text-lg">Filters</Text>
            </HStack>
            <Icon 
              as={ChevronDownIcon} 
              size="sm" 
              className={`text-typography-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </HStack>
        </Pressable>

        {/* Search Input - Always visible */}
        <HStack className="items-center" space="sm">
          <Icon as={SearchIcon} size="sm" className="text-typography-500" />
          <Input className="flex-1">
            <InputField
              placeholder="Search products..."
              value={filters.searchQuery}
              onChangeText={(text) => handleFilterChange('searchQuery', text)}
            />
          </Input>
        </HStack>

        {/* Expandable Filters */}
        {isExpanded && (
          <VStack space="md">
            {/* Sort By */}
            <VStack space="xs">
              <Text className="font-medium">Sort By</Text>
              <Select
                selectedValue={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select sort option" />
                  <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Name (A-Z)" value="name" />
                    <SelectItem label="Price (Low to High)" value="price-low" />
                    <SelectItem label="Price (High to Low)" value="price-high" />
                    <SelectItem label="Newest First" value="newest" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </VStack>

            {/* Price Range */}
            <VStack space="xs">
              <Text className="font-medium">Price Range</Text>
              <HStack space="sm">
                <Input className="flex-1">
                  <InputField
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChangeText={(text) => handleFilterChange('minPrice', text)}
                    keyboardType="numeric"
                  />
                </Input>
                <Text className="self-center">-</Text>
                <Input className="flex-1">
                  <InputField
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChangeText={(text) => handleFilterChange('maxPrice', text)}
                    keyboardType="numeric"
                  />
                </Input>
              </HStack>
            </VStack>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onPress={clearFilters}
              className="mt-2"
            >
              <ButtonText>Clear All Filters</ButtonText>
            </Button>
          </VStack>
        )}
      </VStack>
    </Card>
  );
}