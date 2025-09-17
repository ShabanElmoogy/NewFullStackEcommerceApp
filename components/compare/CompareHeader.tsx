import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft } from 'lucide-react-native';

export interface CompareHeaderProps {
  count: number;
  onBack: () => void;
  onClearAll: () => void;
}

export function CompareHeader({ count, onBack, onClearAll }: CompareHeaderProps) {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderBottomWidth: isDark ? 1 : 0,
        borderBottomColor: colors.border,
        marginBottom : 10
      }}
    >
      <View className="px-4 pb-4">
        <HStack className="items-center justify-between mb-4">
          <HStack className="items-center" space="md">
            <Pressable
              onPress={onBack}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surfaceSecondary }}
            >
              <Icon as={ArrowLeft} size="md" style={{ color: colors.text }} />
            </Pressable>
            <VStack>
              <Text className="font-bold py-3" style={{ color: colors.text, fontSize: 22 }}>Product Comparison</Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>Compare {count} products side by side</Text>
            </VStack>
          </HStack>
          <Pressable
            onPress={onClearAll}
            className="px-4 py-2 rounded-xl border"
            style={{ backgroundColor: colors.error + '15', borderColor: colors.error + '30' }}
          >
            <Text className="font-semibold" style={{ color: colors.error, fontSize: 14 }}>Clear All</Text>
          </Pressable>
        </HStack>
      </View>
    </View>
  );
}

export default CompareHeader;
