import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { useTheme } from '@/hooks/useTheme';
import { getColorForSelectedItem } from '@/utils/selectedColors';
import { useTranslation } from 'react-i18next';

interface BrandOption {
  value: string;
  label: string;
  icon: any;
  color: string;
}

interface BrandsFilterProps {
  brands: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  isDark: boolean;
}

export default function BrandsFilter({
  brands,
  selectedBrands,
  onToggleBrand,
  isDark,
}: BrandsFilterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        {t('productFilter.titles.brands')}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {brands.map((option) => {
          const isSelected = selectedBrands.includes(option.value);
          const IconComponent = option.icon;
          const brandColors = getColorForSelectedItem(option.value, selectedBrands, isDark);
          
          return (
            <Pressable
              key={option.value}
              onPress={() => onToggleBrand(option.value)}
              className="flex-row items-center px-3 py-2 rounded-2xl border"
              style={{
                borderColor: isSelected && brandColors ? brandColors.primary : colors.border,
                backgroundColor: isSelected && brandColors ? brandColors.secondary : colors.surface,
              }}
            >
              <View className="mr-1.5">
                <IconComponent
                  color={isSelected && brandColors ? brandColors.primary : colors.textSecondary}
                  size={16}
                />
              </View>
              <Text
                className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}
                style={{
                  color: isSelected && brandColors ? brandColors.primary : colors.textSecondary,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
