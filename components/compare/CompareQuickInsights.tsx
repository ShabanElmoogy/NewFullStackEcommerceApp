import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { DollarSign, Star, TrendingUp } from 'lucide-react-native';
import { Product } from '@/store/compareStore';

export interface CompareQuickInsightsProps {
  bestValue: Product | null | undefined;
  highestRated: Product | null | undefined;
}

export function CompareQuickInsights({ bestValue, highestRated }: CompareQuickInsightsProps) {
  const { colors, isDark } = useTheme();
  if (!bestValue || !highestRated) return null;
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0.1 : 0.05, shadowRadius: 8, elevation: 3, borderWidth: isDark ? 1 : 0, borderColor: colors.border }}>
      <HStack className="items-center mb-3">
        <Icon as={TrendingUp} size="md" style={{ color: colors.primary, marginRight: 8 }} />
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>Quick Insights</Text>
      </HStack>
      <HStack className="justify-between">
        <View style={{ flex: 1, backgroundColor: colors.success + '10', borderRadius: 12, padding: 12, marginRight: 6, borderWidth: 1, borderColor: colors.success + '20' }}>
          <HStack className="items-center mb-1">
            <Icon as={DollarSign} size="xs" style={{ color: colors.success, marginRight: 4 }} />
            <Text style={{ color: colors.success, fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Best Value</Text>
          </HStack>
          <Text style={{ color: colors.text, fontSize: 12, fontWeight: '500', marginBottom: 2 }} numberOfLines={1}>{bestValue.name}</Text>
          <Text style={{ color: colors.success, fontSize: 16, fontWeight: '700' }}>
            ${bestValue.discount ? (bestValue.price * (1 - bestValue.discount / 100)).toFixed(2) : bestValue.price.toFixed(2)}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.warning + '10', borderRadius: 12, padding: 12, marginLeft: 6, borderWidth: 1, borderColor: colors.warning + '20' }}>
          <HStack className="items-center mb-1">
            <Icon as={Star} size="xs" style={{ color: colors.warning, marginRight: 4 }} />
            <Text style={{ color: colors.warning, fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>Top Rated</Text>
          </HStack>
          <Text style={{ color: colors.text, fontSize: 12, fontWeight: '500', marginBottom: 2 }} numberOfLines={1}>{highestRated.name}</Text>
          <HStack className="items-center">
            <Text style={{ color: colors.warning, fontSize: 16, fontWeight: '700', marginRight: 2 }}>{highestRated.rating?.toFixed(1)}</Text>
            <Icon as={Star} size="xs" style={{ color: colors.warning }} />
          </HStack>
        </View>
      </HStack>
    </View>
  );
}

export default CompareQuickInsights;
