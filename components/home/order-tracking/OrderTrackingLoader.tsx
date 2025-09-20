import React from 'react';
import { View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { RTLChevronRight } from '@/components/ui/icon';
import { Package } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export function OrderTrackingLoader() {
  const { colors } = useTheme();

  return (
    <View className="mx-4 mb-6">
      <View className="rounded-2xl p-4 border" style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}>
        <HStack className="items-center justify-between">
          <HStack className="items-center" space="md">
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{
              backgroundColor: colors.primary + '20',
            }}>
              <Icon as={Package} size="lg" style={{ color: colors.primary }} />
            </View>
            <VStack>
              <View className="h-4 w-32 rounded mb-2" style={{ backgroundColor: colors.textTertiary + '20' }} />
              <View className="h-3 w-24 rounded" style={{ backgroundColor: colors.textTertiary + '15' }} />
            </VStack>
          </HStack>
          <RTLChevronRight size="lg" style={{ color: colors.textTertiary }} />
        </HStack>
      </View>
    </View>
  );
}