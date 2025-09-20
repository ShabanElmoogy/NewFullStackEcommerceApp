import React from 'react';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Trash } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';

interface CartHeaderProps {
  totalQuantity: number;
  onClearAll: () => void;
}

export function CartHeader({ totalQuantity, onClearAll }: CartHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="px-4 pt-4 pb-3 border-b shadow-sm" style={{ 
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      shadowColor: colors.shadow,
    }}>
      <VStack space="md">
        <HStack className="justify-between items-center">
          <VStack>
            <Heading size="lg" style={{ color: colors.text }}>
              Shopping Cart
            </Heading>
            <View className="border rounded-2xl px-3 py-1.5 self-start mt-1" style={{
              borderColor: colors.border,
            }}>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </VStack>

          {/* Clear All Button */}
          <Pressable
            onPress={onClearAll}
            className="flex-row items-center px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: colors.error + '15',
              borderColor: colors.error + '30'
            }}
          >
            <Icon as={Trash} size="sm" className="mr-2" style={{ color: colors.error }} />
            <Text className="font-medium text-sm" style={{ color: colors.error }}>
              Clear All
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </View>
  );
}