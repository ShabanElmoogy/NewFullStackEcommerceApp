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
      <View
        className="rounded-2xl p-8 items-center shadow-lg"
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
          <Icon as={Info} size="lg" style={{ color: colors.textTertiary }} />
        </View>
        <Text className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
          No Specifications Available
        </Text>
        <Text className="text-base text-center" style={{ color: colors.textSecondary }}>
          The selected products don't have detailed specifications to compare.
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
          <Icon as={Info} size="md" style={{ color: colors.primary, marginRight: 12 }} />
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Technical Specifications
          </Text>
        </HStack>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Compare detailed product specifications
        </Text>
      </View>

      {/* Specs */}
      {allSpecs.map((spec, index) => (
        <View
          key={spec}
          style={{ backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary }}
        >
          <View className="px-5 py-4">
            <Text className="text-base font-semibold mb-3" style={{ color: colors.text }}>
              {spec}
            </Text>

            <VStack space="sm">
              {compareList.map((product) => (
                <HStack
                  key={`${product.id}-${spec}`}
                  className="items-center justify-between"
                >
                  <HStack className="items-center flex-1">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <Text className="text-xs font-bold" style={{ color: colors.primary }}>
                        {product.name.charAt(0)}
                      </Text>
                    </View>
                    <Text
                      className="text-sm flex-1"
                      style={{ color: colors.textSecondary }}
                      numberOfLines={1}
                    >
                      {product.name}
                    </Text>
                  </HStack>

                  <Text
                    className="text-sm font-semibold ml-2"
                    style={{ color: colors.text }}
                  >
                    {product.specifications?.[spec] || 'Not specified'}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </View>

          {index < allSpecs.length - 1 && (
            <View className="h-px mx-5" style={{ backgroundColor: colors.border }} />
          )}
        </View>
      ))}
    </View>
  );
}

export default SpecsSection;
