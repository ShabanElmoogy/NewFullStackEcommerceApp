import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import {
  Filter,
  X,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  RotateCcw,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react-native';
import { ORDER_STATUS } from '@/constants/orderStatus';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface FilterOptions {
  status: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
  sortBy: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
  customDateStart?: Date;
  customDateEnd?: Date;
}

interface OrdersFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
  orderCount: number;
}

const statusOptions = [
  { value: ORDER_STATUS.NEW, label: 'New', icon: Clock, color: '#F59E0B' },
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmed', icon: CheckCircle, color: '#10B981' },
  { value: ORDER_STATUS.PROCESSING, label: 'Processing', icon: Package, color: '#3B82F6' },
  { value: ORDER_STATUS.SHIPPED, label: 'Shipped', icon: Truck, color: '#8B5CF6' },
  { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: MapPin, color: '#EF4444' },
  { value: ORDER_STATUS.DELIVERED, label: 'Delivered', icon: CheckCircle, color: '#059669' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelled', icon: AlertCircle, color: '#6B7280' },
  { value: ORDER_STATUS.RETURNED, label: 'Returned', icon: RotateCcw, color: '#DC2626' },
];

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'amount_high', label: 'Amount: High to Low' },
  { value: 'amount_low', label: 'Amount: Low to High' },
];

export function OrdersFilter({ onFilterChange, activeFilters, orderCount }: OrdersFilterProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(activeFilters);

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

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
      status: [],
      dateRange: 'all',
      sortBy: 'newest',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
    closeModal();
  };

  const toggleStatus = (status: string) => {
    setLocalFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.status.length > 0) count++;
    if (activeFilters.dateRange !== 'all') count++;
    if (activeFilters.sortBy !== 'newest') count++;
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
        <ChevronDown color="#6B7280" size={16} style={{ marginLeft: 8 }} />
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
                marginBottom: 16,
              }}
            />

            {/* Header */}
            <HStack style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
                Filter Orders
              </Text>
              <Pressable onPress={closeModal} style={{ padding: 4 }}>
                <X color="#6B7280" size={24} />
              </Pressable>
            </HStack>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Order Status Filter */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                  Order Status
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {statusOptions.map((option) => {
                    const isSelected = localFilters.status.includes(option.value);
                    const IconComponent = option.icon;
                    
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => toggleStatus(option.value)}
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

              {/* Date Range Filter */}
              <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
                  Date Range
                </Text>
                <VStack style={{ gap: 8 }}>
                  {dateRangeOptions.map((option) => {
                    const isSelected = localFilters.dateRange === option.value;
                    
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => setLocalFilters(prev => ({ ...prev, dateRange: option.value as any }))}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor: isSelected ? '#EBF8FF' : '#F9FAFB',
                          borderWidth: 1,
                          borderColor: isSelected ? '#3B82F6' : '#E5E7EB',
                        }}
                      >
                        <Calendar
                          color={isSelected ? '#3B82F6' : '#6B7280'}
                          size={18}
                          style={{ marginRight: 12 }}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: isSelected ? '600' : '500',
                            color: isSelected ? '#3B82F6' : '#374151',
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
                              backgroundColor: '#3B82F6',
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
                  {orderCount} order{orderCount !== 1 ? 's' : ''} found
                </Text>
              </View>
            </ScrollView>

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
