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
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <View style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 32,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 16,
        elevation: 8,
        alignItems: 'center',
        maxWidth: 320,
        width: '100%',
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
      }}>
        <View style={{ width: 80, height: 80, backgroundColor: colors.primary + '15', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Icon as={Package} size="xl" style={{ color: colors.primary }} />
        </View>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>No Products to Compare</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, marginBottom: 24, textAlign: 'center', lineHeight: 24 }}>Add products to comparison from the products page to see detailed side-by-side comparisons</Text>
        <Pressable onPress={onBrowseProducts} style={{ backgroundColor: colors.primary, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, width: '100%', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Browse Products</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default CompareEmptyState;
