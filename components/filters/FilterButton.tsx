import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../ui/text';
import { Badge, BadgeText } from '../ui/badge';
import { SlidersHorizontal, ChevronDownIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface FilterButtonProps {
  onPress: () => void;
  activeFilterCount: number;
}

export default function FilterButton({ onPress, activeFilterCount }: FilterButtonProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3 rounded-xl border shadow-sm"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="mr-2">
        <SlidersHorizontal color={colors.textSecondary} size={20} />
      </View>
      <Text className="text-sm font-semibold flex-1" style={{ color: colors.text }}>
        {t('productFilter.titles.filterAndSort')}
      </Text>
      {activeFilterCount > 0 && (
        <Badge
          className="rounded-xl px-2 py-1 ml-2"
          style={{ backgroundColor: colors.primary }}
        >
          <BadgeText className="text-xs font-bold" style={{ color: colors.textInverse }}>
            {activeFilterCount}
          </BadgeText>
        </Badge>
      )}
      <View className="ml-2">
        <ChevronDownIcon color={colors.textSecondary} size={16} />
      </View>
    </Pressable>
  );
}
