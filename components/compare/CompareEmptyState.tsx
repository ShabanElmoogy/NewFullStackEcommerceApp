import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { Package } from 'lucide-react-native';

export interface CompareEmptyStateProps {
  onBrowseProducts: () => void;
}

export function CompareEmptyState({ onBrowseProducts }: CompareEmptyStateProps) {
  const { colors, isDark } = useTheme();
  return (
    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.background }}>
      <View
        className="rounded-3xl p-8 items-center w-full max-w-xs"
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 16,
          elevation: 8,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.border,
        }}
      >
        <View className="w-20 h-20 rounded-full items-center justify-center mb-5" style={{ backgroundColor: colors.primary + '15' }}>
          <Icon as={Package} size="xl" style={{ color: colors.primary }} />
        </View>
        <Text className="text-center font-bold mb-2" style={{ color: colors.text, fontSize: 24 }}>No Products to Compare</Text>
        <Text className="text-center mb-6" style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24 }}>
          Add products to comparison from the products page to see detailed side-by-side comparisons
        </Text>
        <Pressable onPress={onBrowseProducts} className="rounded-2xl py-4 w-full items-center" style={{ backgroundColor: colors.primary }}>
          <Text className="font-semibold" style={{ color: 'white', fontSize: 16 }}>Browse Products</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default CompareEmptyState;
