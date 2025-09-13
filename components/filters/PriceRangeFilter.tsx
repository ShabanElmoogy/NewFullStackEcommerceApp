import React, { RefObject } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Input, InputField } from '../ui/input';
import { useTheme } from '@/hooks/useTheme';

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (text: string) => void;
  onMaxPriceChange: (text: string) => void;
  scrollViewRef: RefObject<ScrollView>;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  scrollViewRef,
}: PriceRangeFilterProps) {
  const { colors } = useTheme();

  const handleScroll = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 1000,
        animated: true,
      });
    }, 300);
  };

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        Price Range
      </Text>
      <HStack className="gap-3">
        <View className="flex-1">
          <Input>
            <InputField
              placeholder="Min price"
              value={minPrice}
              onChangeText={onMinPriceChange}
              keyboardType="numeric"
              onFocus={handleScroll}
            />
          </Input>
        </View>
        <Text className="self-center" style={{ color: colors.textSecondary }}>-</Text>
        <View className="flex-1">
          <Input>
            <InputField
              placeholder="Max price"
              value={maxPrice}
              onChangeText={onMaxPriceChange}
              keyboardType="numeric"
              onFocus={handleScroll}
            />
          </Input>
        </View>
      </HStack>
    </View>
  );
}