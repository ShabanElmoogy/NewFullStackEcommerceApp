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
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <HStack className="items-center justify-between mb-4">
          <HStack className="items-center" space="md">
            <Pressable
              onPress={onBack}
              style={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 22,
                backgroundColor: colors.surfaceSecondary,
              }}
            >
              <Icon as={ArrowLeft} size="md" style={{ color: colors.text }} />
            </Pressable>
            <VStack>
              <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>Product Comparison</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Compare {count} products side by side</Text>
            </VStack>
          </HStack>
          <Pressable
            onPress={onClearAll}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: colors.error + '15',
              borderWidth: 1,
              borderColor: colors.error + '30',
            }}
          >
            <Text style={{ color: colors.error, fontSize: 14, fontWeight: '600' }}>Clear All</Text>
          </Pressable>
        </HStack>
      </View>
    </View>
  );
}

export default CompareHeader;
