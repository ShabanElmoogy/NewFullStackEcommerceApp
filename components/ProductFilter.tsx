import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Text } from './ui/text';
import { VStack } from './ui/vstack';
import { HStack } from './ui/hstack';
import { Input, InputField } from './ui/input';
import { Button, ButtonText } from './ui/button';
import { Badge, BadgeText } from './ui/badge';
import {
  FilterIcon,
  XIcon,
  SearchIcon,
  StarIcon,
  TagIcon,
  PackageIcon,
  ChevronDownIcon,
  SlidersHorizontal,
  CheckCircle,
} from 'lucide-react-native';
import { Switch } from './ui/switch';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface FilterOptions {
  searchQuery: string;
  sortBy: 'name' | 'price-low' | 'price-high' | 'newest' | 'rating' | 'popularity';
  minPrice: string;
  maxPrice: string;
  categories: string[];
  brands: string[];
  minRating: number;
  inStock: boolean | null; // null = all, true = in stock only, false = out of stock only
  onSale: boolean;
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  productCount: number;
}

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
];

const categoryOptions = [
  { value: 'Electronics', label: 'Electronics', icon: PackageIcon, color: '#3B82F6' },
  { value: 'Clothing', label: 'Clothing', icon: TagIcon, color: '#10B981' },
  { value: 'Books', label: 'Books', icon: PackageIcon, color: '#F59E0B' },
  { value: 'Home & Garden', label: 'Home & Garden', icon: PackageIcon, color: '#8B5CF6' },
  { value: 'Sports', label: 'Sports', icon: PackageIcon, color: '#EF4444' },
  { value: 'Beauty', label: 'Beauty', icon: PackageIcon, color: '#EC4899' },
];

const brandOptions = [
  { value: 'Apple', label: 'Apple', icon: PackageIcon, color: '#6B7280' },
  { value: 'Samsung', label: 'Samsung', icon: PackageIcon, color: '#3B82F6' },
  { value: 'Nike', label: 'Nike', icon: PackageIcon, color: '#000000' },
  { value: 'Adidas', label: 'Adidas', icon: PackageIcon, color: '#000000' },
  { value: 'Sony', label: 'Sony', icon: PackageIcon, color: '#000000' },
  { value: 'LG', label: 'LG', icon: PackageIcon, color: '#DC2626' },
];

export default function ProductFilter({ onFilterChange, activeFilters, productCount }: ProductFilterProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Default filter values to prevent undefined errors
  const defaultFilters: FilterOptions = {
    searchQuery: '',
    sortBy: 'name',
    minPrice: '',
    maxPrice: '',
    categories: [],
    brands: [],
    minRating: 0,
    inStock: null,
    onSale: false,
  };

  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters || defaultFilters);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activeFilters) {
      setLocalFilters(activeFilters);
    }
  }, [activeFilters]);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isScrolledToTop = contentOffset.y <= 10;
    const isNearBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 50;
    
    // Hide scroll hint when user starts scrolling or reaches near bottom
    if (!isScrolledToTop || isNearBottom) {
      setShowScrollHint(false);
    }
  };

  const resetScrollHint = () => {
    setShowScrollHint(true);
  };

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    closeModal();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      searchQuery: '',
      sortBy: 'name',
      minPrice: '',
      maxPrice: '',
      categories: [],
      brands: [],
      minRating: 0,
      inStock: null,
      onSale: false,
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    closeModal();
  };

  const toggleCategory = (category: string) => {
    setLocalFilters(prev => {
      const categories = prev.categories || [];
      return {
        ...prev,
        categories: categories.includes(category)
          ? categories.filter(c => c !== category)
          : [...categories, category]
      };
    });
  };

  const toggleBrand = (brand: string) => {
    setLocalFilters(prev => {
      const brands = prev.brands || [];
      return {
        ...prev,
        brands: brands.includes(brand)
          ? brands.filter(b => b !== brand)
          : [...brands, brand]
      };
    });
  };

  const getActiveFilterCount = () => {
    if (!activeFilters) return 0;
    
    let count = 0;
    if (activeFilters.searchQuery) count++;
    if (activeFilters.sortBy !== 'name') count++;
    if (activeFilters.minPrice) count++;
    if (activeFilters.maxPrice) count++;
    if (activeFilters.categories && activeFilters.categories.length > 0) count++;
    if (activeFilters.brands && activeFilters.brands.length > 0) count++;
    if (activeFilters.minRating > 0) count++;
    if (activeFilters.inStock !== null) count++;
    if (activeFilters.onSale) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      {/* Filter Button */}
      <Pressable
        onPress={openModal}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
          marginHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <SlidersHorizontal color="#6B7280" size={20} style={{ marginRight: 8 }} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', flex: 1 }}>
          Filter & Sort
        </Text>
        {activeFilterCount > 0 && (
          <Badge
            style={{
              backgroundColor: '#3B82F6',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginLeft: 8,
            }}
          >
            <BadgeText style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
              {activeFilterCount}
            </BadgeText>
          </Badge>
        )}
        <ChevronDownIcon color="#6B7280" size={16} style={{ marginLeft: 8 }} />
      </Pressable>

      {/* Filter Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        onRequestClose={closeModal}
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Handle Bar */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: '#D1D5DB',
              borderRadius: 2,
              alignSelf: 'center',
              marginTop: 12,
              marginBottom: 16,
            }}
          />

          {/* Header */}
          <HStack style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
              Filter Products
            </Text>
            <Pressable onPress={closeModal} style={{ padding: 4 }}>
              <XIcon color="#6B7280" size={24} />
            </Pressable>
          </HStack>

          <View style={{ flex: 1 }}>
            <ScrollView 
              ref={scrollViewRef}
              style={{ flex: 1 }} 
              contentContainerStyle={{ 
                paddingBottom: 20,
                flexGrow: 1 
              }}
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
              scrollIndicatorInsets={{ right: 3 }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              bounces={true}
              alwaysBounceVertical={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              persistentScrollbar={true}
              fadingEdgeLength={0}
            >
            {/* Categories Filter */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Categories
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {categoryOptions.map((option) => {
                  const isSelected = localFilters.categories && localFilters.categories.includes(option.value);
                  const IconComponent = option.icon;
                  
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => toggleCategory(option.value)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isSelected ? option.color : '#E5E7EB',
                        backgroundColor: isSelected ? `${option.color}15` : '#FFFFFF',
                      }}
                    >
                      <IconComponent
                        color={isSelected ? option.color : '#6B7280'}
                        size={16}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '600' : '500',
                          color: isSelected ? option.color : '#6B7280',
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Brands Filter */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Brands
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {brandOptions.map((option) => {
                  const isSelected = localFilters.brands && localFilters.brands.includes(option.value);
                  const IconComponent = option.icon;
                  
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => toggleBrand(option.value)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isSelected ? option.color : '#E5E7EB',
                        backgroundColor: isSelected ? `${option.color}15` : '#FFFFFF',
                      }}
                    >
                      <IconComponent
                        color={isSelected ? option.color : '#6B7280'}
                        size={16}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '600' : '500',
                          color: isSelected ? option.color : '#6B7280',
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Price Range */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Price Range
              </Text>
              <HStack style={{ gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Input>
                    <InputField
                      placeholder="Min price"
                      value={localFilters.minPrice}
                      onChangeText={(text) => setLocalFilters(prev => ({ ...prev, minPrice: text }))}
                      keyboardType="numeric"
                    />
                  </Input>
                </View>
                <Text style={{ alignSelf: 'center', color: '#6B7280' }}>-</Text>
                <View style={{ flex: 1 }}>
                  <Input>
                    <InputField
                      placeholder="Max price"
                      value={localFilters.maxPrice}
                      onChangeText={(text) => setLocalFilters(prev => ({ ...prev, maxPrice: text }))}
                      keyboardType="numeric"
                    />
                  </Input>
                </View>
              </HStack>
            </View>

            {/* Rating Filter */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Minimum Rating
              </Text>
              <HStack style={{ gap: 12, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map((rating) => {
                  const isSelected = localFilters.minRating >= rating;
                  
                  return (
                    <Pressable
                      key={rating}
                      onPress={() => setLocalFilters(prev => ({ 
                        ...prev, 
                        minRating: prev.minRating === rating ? 0 : rating 
                      }))}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: isSelected ? '#FEF3C7' : '#F9FAFB',
                        borderWidth: 1,
                        borderColor: isSelected ? '#F59E0B' : '#E5E7EB',
                      }}
                    >
                      {Array.from({ length: rating }, (_, i) => (
                        <StarIcon
                          key={i}
                          color={isSelected ? '#F59E0B' : '#D1D5DB'}
                          size={16}
                          style={{ marginRight: 2 }}
                        />
                      ))}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '600' : '500',
                          color: isSelected ? '#F59E0B' : '#6B7280',
                          marginLeft: 4,
                        }}
                      >
                        {rating}+
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>
            </View>

            {/* Availability & Offers */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Availability & Offers
              </Text>
              
              {/* Stock Status */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Stock Status
                </Text>
                <HStack style={{ gap: 8 }}>
                  {[
                    { value: null, label: 'All' },
                    { value: true, label: 'In Stock' },
                    { value: false, label: 'Out of Stock' }
                  ].map((option) => {
                    const isSelected = localFilters.inStock === option.value;
                    
                    return (
                      <Pressable
                        key={String(option.value)}
                        onPress={() => setLocalFilters(prev => ({ ...prev, inStock: option.value }))}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 12,
                          backgroundColor: isSelected ? '#EBF8FF' : '#F9FAFB',
                          borderWidth: 1,
                          borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: isSelected ? '600' : '500',
                            color: isSelected ? '#3B82F6' : '#374151',
                          }}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </HStack>
              </View>

              {/* On Sale */}
              <HStack style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>
                  On Sale Only
                </Text>
                <Switch
                  value={localFilters.onSale}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, onSale: value }))}
                />
              </HStack>
            </View>

            {/* Sort Options */}
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                Sort By
              </Text>
              <VStack style={{ gap: 8 }}>
                {sortOptions.map((option) => {
                  const isSelected = localFilters.sortBy === option.value;
                  
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setLocalFilters(prev => ({ ...prev, sortBy: option.value as any }))}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: isSelected ? '#F0FDF4' : '#F9FAFB',
                        borderWidth: 1,
                        borderColor: isSelected ? '#10B981' : '#E5E7EB',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '600' : '500',
                          color: isSelected ? '#10B981' : '#374151',
                          flex: 1,
                        }}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: '#10B981',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircle color="#FFFFFF" size={12} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </VStack>
            </View>

            {/* Results Preview */}
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 24,
                padding: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                {productCount} product{productCount !== 1 ? 's' : ''} found
              </Text>
            </View>
          </ScrollView>
          </View>

          {/* Action Buttons */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              backgroundColor: '#FFFFFF',
            }}
          >
            <HStack style={{ gap: 12 }}>
              <Button
                onPress={handleResetFilters}
                style={{
                  flex: 1,
                  backgroundColor: '#F9FAFB',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <ButtonText style={{ color: '#374151' }}>Reset</ButtonText>
              </Button>
              <Button
                onPress={handleApplyFilters}
                style={{
                  flex: 2,
                  backgroundColor: '#3B82F6',
                }}
              >
                <ButtonText style={{ color: '#FFFFFF' }}>Apply Filters</ButtonText>
              </Button>
            </HStack>
          </View>
        </View>
      </Modal>
    </>
  );
}