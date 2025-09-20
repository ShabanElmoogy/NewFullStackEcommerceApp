import React from 'react';
import { View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useTheme } from '@/hooks/useTheme';

interface CartSummaryProps {
  totalQuantity: number;
  subtotal: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  freeShippingMessage?: string | null;
}

export function CartSummary({ 
  totalQuantity, 
  subtotal, 
  shipping, 
  tax, 
  finalTotal, 
  freeShippingMessage 
}: CartSummaryProps) {
  const { colors } = useTheme();

  return (
    <View className="rounded-xl p-4 border shadow-sm" style={{
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    }}>
      <VStack space="md">
        <Heading size="md" className="mb-2" style={{ color: colors.text }}>
          Order Summary
        </Heading>

        <VStack space="sm">
          <HStack className="justify-between">
            <Text style={{ color: colors.textSecondary }}>
              Subtotal ({totalQuantity} items)
            </Text>
            <Text className="font-semibold" style={{ color: colors.text }}>
              ${subtotal.toFixed(2)}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text style={{ color: colors.textSecondary }}>Shipping</Text>
            <Text className="font-semibold" style={{ color: colors.text }}>
              {shipping === 0 ? (
                <Text style={{ color: colors.success }}>FREE</Text>
              ) : (
                `${shipping.toFixed(2)}`
              )}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text style={{ color: colors.textSecondary }}>Tax</Text>
            <Text className="font-semibold" style={{ color: colors.text }}>
              ${tax.toFixed(2)}
            </Text>
          </HStack>

          <View className="h-px my-2" style={{ backgroundColor: colors.border }} />

          <HStack className="justify-between">
            <Heading size="md" style={{ color: colors.text }}>Total</Heading>
            <Heading size="md" style={{ color: colors.primary }}>
              ${finalTotal.toFixed(2)}
            </Heading>
          </HStack>
        </VStack>

        {freeShippingMessage && (
          <Text className="text-sm mt-2" style={{
            color: colors.textTertiary,
          }}>
            {freeShippingMessage}
          </Text>
        )}
      </VStack>
    </View>
  );
}