import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { CreditCard } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';

interface CheckoutDialogProps {
  visible: boolean;
  totalQuantity: number;
  subtotal: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  isCreatingOrder: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CheckoutDialog({ 
  visible, 
  totalQuantity, 
  subtotal, 
  shipping, 
  tax, 
  finalTotal, 
  isCreatingOrder, 
  onConfirm, 
  onCancel 
}: CheckoutDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center p-5 bg-black/60">
        <Pressable
          className="absolute inset-0"
          onPress={onCancel}
        />

        <View className="rounded-2xl p-6 w-full max-w-sm shadow-2xl" style={{
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        }}>
          {/* Checkout Icon */}
          <View className="items-center mb-5">
            <View className="w-15 h-15 rounded-full items-center justify-center mb-4" style={{
              backgroundColor: colors.primary + '20',
            }}>
              <Icon as={CreditCard} size="xl" style={{ color: colors.primary }} />
            </View>

            <Heading size="xl" className="text-center mb-2" style={{
              color: colors.text,
            }}>
              Confirm Order
            </Heading>
          </View>

          {/* Order Details */}
          <VStack space="md" className="mb-6">
            <Text className="text-center text-base leading-6" style={{
              color: colors.textSecondary,
            }}>
              You're about to place an order for{' '}
              <Text className="font-bold" style={{ color: colors.text }}>
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </Text>
            </Text>

            {/* Order Summary in Dialog */}
            <View className="rounded-xl p-4 mt-2" style={{
              backgroundColor: colors.surfaceSecondary,
            }}>
              <VStack space="sm">
                <HStack className="justify-between">
                  <Text style={{ color: colors.textSecondary }}>Subtotal:</Text>
                  <Text className="font-semibold" style={{ color: colors.text }}>
                    ${subtotal.toFixed(2)}
                  </Text>
                </HStack>
                
                <HStack className="justify-between">
                  <Text style={{ color: colors.textSecondary }}>Shipping:</Text>
                  <Text className="font-semibold" style={{ color: colors.text }}>
                    {shipping === 0 ? (
                      <Text style={{ color: colors.success }}>FREE</Text>
                    ) : (
                      `${shipping.toFixed(2)}`
                    )}
                  </Text>
                </HStack>
                
                <HStack className="justify-between">
                  <Text style={{ color: colors.textSecondary }}>Tax:</Text>
                  <Text className="font-semibold" style={{ color: colors.text }}>
                    ${tax.toFixed(2)}
                  </Text>
                </HStack>
                
                <View className="h-px my-2" style={{ backgroundColor: colors.border }} />
                
                <HStack className="justify-between">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Total:
                  </Text>
                  <Text className="font-bold text-lg" style={{ color: colors.primary }}>
                    ${finalTotal.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </View>
          </VStack>

          {/* Action Buttons */}
          <VStack space="md">
            <Button
              onPress={onConfirm}
              disabled={isCreatingOrder}
              className="h-12"
              style={{
                backgroundColor: colors.primary,
                opacity: isCreatingOrder ? 0.7 : 1,
              }}
            >
              <HStack space="sm" className="items-center">
                {isCreatingOrder ? (
                  <View className="w-5 h-5 rounded-full border-2" style={{
                    borderColor: colors.textInverse + '30',
                    borderTopColor: colors.textInverse,
                  }} />
                ) : (
                  <Icon as={CreditCard} size="sm" style={{ color: colors.textInverse }} />
                )}
                <ButtonText className="text-base font-semibold" style={{
                  color: colors.textInverse,
                }}>
                  {isCreatingOrder ? 'Processing...' : 'Place Order'}
                </ButtonText>
              </HStack>
            </Button>

            <Button
              variant="outline"
              onPress={onCancel}
              disabled={isCreatingOrder}
              className="bg-transparent h-12"
              style={{
                borderColor: colors.border,
                opacity: isCreatingOrder ? 0.5 : 1,
              }}
            >
              <ButtonText className="text-base font-medium" style={{
                color: colors.textSecondary,
              }}>
                Cancel
              </ButtonText>
            </Button>
          </VStack>
        </View>
      </View>
    </Modal>
  );
}