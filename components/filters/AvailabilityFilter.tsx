import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Switch } from '../ui/switch';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface AvailabilityFilterProps {
  inStock: boolean | null;
  onSale: boolean;
  onStockChange: (value: boolean | null) => void;
  onSaleChange: (value: boolean) => void;
}

export default function AvailabilityFilter({
  inStock,
  onSale,
  onStockChange,
  onSaleChange,
}: AvailabilityFilterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const stockOptions = [
    { value: null, label: t('productFilter.availability.stockOptions.all') },
    { value: true, label: t('productFilter.availability.stockOptions.inStock') },
    { value: false, label: t('productFilter.availability.stockOptions.outOfStock') }
  ];

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        {t('productFilter.titles.availabilityOffers')}
      </Text>
      
      {/* Stock Status */}
      <View className="mb-4">
        <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
          {t('productFilter.titles.stockStatus')}
        </Text>
        <HStack className="gap-2">
          {stockOptions.map((option) => {
            const isSelected = inStock === option.value;
            
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onStockChange(option.value)}
                className="px-4 py-2 rounded-xl border"
                style={{
                  backgroundColor: isSelected ? colors.primary + '20' : colors.backgroundSecondary,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <Text
                  className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}
                  style={{
                    color: isSelected ? colors.primary : colors.text,
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
      <HStack className="justify-between items-center">
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
          {t('productFilter.availability.onSaleOnly')}
        </Text>
        <Switch
          value={onSale}
          onValueChange={onSaleChange}
        />
      </HStack>
    </View>
  );
}
