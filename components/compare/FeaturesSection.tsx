import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { Check, X } from 'lucide-react-native';
import { Product } from '@/store/compareStore';

export interface FeaturesSectionProps {
  allFeatures: string[];
  compareList: Product[];
}

export function FeaturesSection({ allFeatures, compareList }: FeaturesSectionProps) {
  const { colors, isDark } = useTheme();
  if (!allFeatures?.length) {
    return (
      <View style={{ backgroundColor: colors.card, borderRadius: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.1, shadowRadius: 12, elevation: 6, borderWidth: isDark ? 1 : 0, borderColor: colors.border, padding: 32, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, backgroundColor: colors.surfaceSecondary, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon as={Check} size="lg" style={{ color: colors.textTertiary }} />
        </View>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>No Features Available</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>The selected products don't have feature lists to compare.</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.1, shadowRadius: 12, elevation: 6, borderWidth: isDark ? 1 : 0, borderColor: colors.border, overflow: 'hidden' }}>
      <View style={{ backgroundColor: colors.surfaceSecondary, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <HStack className="items-center mb-2">
          <Icon as={Check} size="md" style={{ color: colors.primary, marginRight: 12 }} />
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Features Comparison</Text>
        </HStack>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>See which features are available in each product</Text>
      </View>
      {allFeatures.map((feature, index) => (
        <View key={feature} style={{ backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>{feature}</Text>
            <HStack className="justify-between">
              {compareList.map((product) => (
                <View key={`${product.id}-${feature}`} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{product.name.charAt(0)}</Text>
                  </View>
                  <View style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: product.features?.includes(feature) ? colors.success + '15' : colors.error + '15', borderWidth: 1, borderColor: product.features?.includes(feature) ? colors.success + '30' : colors.error + '30' }}>
                    <Icon as={product.features?.includes(feature) ? Check : X} size="sm" style={{ color: product.features?.includes(feature) ? colors.success : colors.error }} />
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }} numberOfLines={1}>
                    {product.name.split(' ')[0]}
                  </Text>
                </View>
              ))}
            </HStack>
          </View>
          {index < allFeatures.length - 1 && <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />}
        </View>
      ))}
    </View>
  );
}

export default FeaturesSection;
