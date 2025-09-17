import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { Info } from 'lucide-react-native';
import { Product } from '@/store/compareStore';

export interface SpecsSectionProps {
  allSpecs: string[];
  compareList: Product[];
}

export function SpecsSection({ allSpecs, compareList }: SpecsSectionProps) {
  const { colors, isDark } = useTheme();
  if (!allSpecs?.length) {
    return (
      <View style={{ backgroundColor: colors.card, borderRadius: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.1, shadowRadius: 12, elevation: 6, borderWidth: isDark ? 1 : 0, borderColor: colors.border, padding: 32, alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, backgroundColor: colors.surfaceSecondary, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon as={Info} size="lg" style={{ color: colors.textTertiary }} />
        </View>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>No Specifications Available</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>The selected products don't have detailed specifications to compare.</Text>
      </View>
    );
  }
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDark ? 0.2 : 0.1, shadowRadius: 12, elevation: 6, borderWidth: isDark ? 1 : 0, borderColor: colors.border, overflow: 'hidden' }}>
      <View style={{ backgroundColor: colors.surfaceSecondary, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <HStack className="items-center mb-2">
          <Icon as={Info} size="md" style={{ color: colors.primary, marginRight: 12 }} />
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Technical Specifications</Text>
        </HStack>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Compare detailed product specifications</Text>
      </View>
      {allSpecs.map((spec, index) => (
        <View key={spec} style={{ backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 }}>{spec}</Text>
            <VStack space="sm">
              {compareList.map((product) => (
                <HStack key={`${product.id}-${spec}`} className="items-center justify-between">
                  <HStack className="items-center flex-1">
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{product.name.charAt(0)}</Text>
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 14, flex: 1 }} numberOfLines={1}>{product.name}</Text>
                  </HStack>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginLeft: 8 }}>
                    {product.specifications?.[spec] || 'Not specified'}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </View>
          {index < allSpecs.length - 1 && <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 20 }} />}
        </View>
      ))}
    </View>
  );
}

export default SpecsSection;
