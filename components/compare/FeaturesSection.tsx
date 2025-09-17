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
      <View
        className={`rounded-2xl p-8 items-center shadow-lg`}
        style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
          shadowOpacity: isDark ? 0.2 : 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 12,
          elevation: 6,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.border,
        }}
      >
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <Icon as={Check} size="lg" style={{ color: colors.textTertiary }} />
        </View>
        <Text className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
          No Features Available
        </Text>
        <Text className="text-base text-center" style={{ color: colors.textSecondary }}>
          The selected products don't have feature lists to compare.
        </Text>
      </View>
    );
  }

  return (
    <View
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <View
        className="px-5 py-4 border-b"
        style={{ backgroundColor: colors.surfaceSecondary, borderBottomColor: colors.border }}
      >
        <HStack className="items-center mb-2">
          <Icon as={Check} size="md" style={{ color: colors.primary, marginRight: 12 }} />
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Features Comparison
          </Text>
        </HStack>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          See which features are available in each product
        </Text>
      </View>

      {/* Features */}
      {allFeatures.map((feature, index) => (
        <View
          key={feature}
          style={{ backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary }}
        >
          <View className="px-5 py-4">
            <Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
              {feature}
            </Text>

            <HStack className="justify-between">
              {compareList.map((product) => {
                const hasFeature = product.features?.includes(feature);
                return (
                  <View key={`${product.id}-${feature}`} className="flex-1 items-center">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <Text className="text-xs font-bold" style={{ color: colors.primary }}>
                        {product.name.charAt(0)}
                      </Text>
                    </View>

                    <View
                      className="w-8 h-8 rounded-full items-center justify-center border"
                      style={{
                        backgroundColor: hasFeature ? colors.success + '15' : colors.error + '15',
                        borderColor: hasFeature ? colors.success + '30' : colors.error + '30',
                      }}
                    >
                      <Icon
                        as={hasFeature ? Check : X}
                        size="sm"
                        style={{ color: hasFeature ? colors.success : colors.error }}
                      />
                    </View>

                    <Text
                      className="text-xs mt-1 text-center"
                      style={{ color: colors.textSecondary }}
                      numberOfLines={1}
                    >
                      {product.name.split(' ')[0]}
                    </Text>
                  </View>
                );
              })}
            </HStack>
          </View>

          {index < allFeatures.length - 1 && <View className="h-px mx-5" style={{ backgroundColor: colors.border }} />}
        </View>
      ))}
    </View>
  );
}

export default FeaturesSection;
