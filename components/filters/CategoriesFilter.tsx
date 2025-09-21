import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { useTheme } from '@/hooks/useTheme';
import { getColorForSelectedItem } from '@/utils/selectedColors';
import { useTranslation } from 'react-i18next';

interface CategoryOption {
  value: string;
  label: string;
  icon: any;
}

interface CategoriesFilterProps {
  categories: CategoryOption[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  isLoading: boolean;
  isDark: boolean;
}

export default function CategoriesFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  isLoading,
  isDark,
}: CategoriesFilterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="px-5 mb-6">
      <Text className="text-base font-bold mb-3" style={{ color: colors.text }}>
        {t('productFilter.titles.categories')}
      </Text>
      {isLoading ? (
        <View className="h-10 justify-center items-center">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>{t('productFilter.loading.loadingCategories')}</Text>
        </View>
      ) : categories.length === 0 ? (
        <View className="h-10 justify-center items-center">
          <Text className="text-sm" style={{ color: colors.textSecondary }}>{t('productFilter.loading.noCategories')}</Text>
        </View>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {categories.map((option) => {
            const isSelected = selectedCategories.includes(option.value);
            const IconComponent = option.icon;
            const categoryColors = getColorForSelectedItem(option.value, selectedCategories, isDark);
            
            return (
              <Pressable
                key={option.value}
                onPress={() => onToggleCategory(option.value)}
                className="flex-row items-center px-3 py-2 rounded-2xl border"
                style={{
                  borderColor: isSelected && categoryColors ? categoryColors.primary : colors.border,
                  backgroundColor: isSelected && categoryColors ? categoryColors.secondary : colors.surface,
                }}
              >
                <View className="mr-1.5">
                  <IconComponent
                    color={isSelected && categoryColors ? categoryColors.primary : colors.textSecondary}
                    size={16}
                  />
                </View>
                <Text
                  className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}
                  style={{
                    color: isSelected && categoryColors ? categoryColors.primary : colors.textSecondary,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
