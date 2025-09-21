import React, { RefObject } from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Input, InputField } from '../ui/input';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleScroll = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 10,
        animated: true,
      });
    }, 300);
  };

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        {t('productFilter.titles.priceRange')}
      </Text>
      <HStack className="gap-3">
        <View className="flex-1">
          <Input>
            <InputField
              placeholder={t('productFilter.price.minPrice')}
              value={minPrice}
              onChangeText={onMinPriceChange}
              keyboardType="numeric"
            />
          </Input>
        </View>
        <Text className="self-center" style={{ color: colors.textSecondary }}>-</Text>
        <View className="flex-1">
          <Input>
            <InputField
              placeholder={t('productFilter.price.maxPrice')}
              value={maxPrice}
              onChangeText={onMaxPriceChange}
              keyboardType="numeric"
            />
          </Input>
        </View>
      </HStack>
    </View>
  );
}
