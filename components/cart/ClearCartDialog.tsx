import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Trash } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';

interface ClearCartDialogProps {
  visible: boolean;
  totalQuantity: number;
  isClearing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearCartDialog({ 
  visible, 
  totalQuantity, 
  isClearing, 
  onConfirm, 
  onCancel 
}: ClearCartDialogProps) {
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
          <View className="items-center mb-5">
            <View className="w-15 h-15 rounded-full items-center justify-center mb-4" style={{
              backgroundColor: colors.error + '20',
            }}>
              <Icon as={Trash} size="xl" style={{ color: colors.error }} />
            </View>

            <Heading size="xl" className="text-center mb-2" style={{
              color: colors.text,
            }}>
              Clear Cart
            </Heading>
          </View>

          <Text className="text-center mb-8 text-base leading-6" style={{
            color: colors.textSecondary,
          }}>
            Are you sure you want to remove all{' '}
            <Text className="font-bold" style={{ color: colors.text }}>
              {totalQuantity} items
            </Text>
            {' '}from your cart? This action cannot be undone.
          </Text>

          <VStack space="md">
            <Button
              onPress={onConfirm}
              disabled={isClearing}
              className="h-12"
              style={{
                backgroundColor: colors.error,
                opacity: isClearing ? 0.7 : 1,
              }}
            >
              <HStack space="sm" className="items-center">
                {isClearing ? (
                  <View className="w-5 h-5 rounded-full border-2" style={{
                    borderColor: colors.textInverse + '30',
                    borderTopColor: colors.textInverse,
                  }} />
                ) : (
                  <Icon as={Trash} size="sm" style={{ color: colors.text }} />
                )}
                <ButtonText className="text-base font-semibold" style={{
                  color: colors.text,
                }}>
                  {isClearing ? 'Clearing...' : 'Clear All Items'}
                </ButtonText>
              </HStack>
            </Button>

            <Button
              variant="outline"
              onPress={onCancel}
              disabled={isClearing}
              className="bg-transparent h-12"
              style={{
                borderColor: colors.border,
                opacity: isClearing ? 0.5 : 1,
              }}
            >
              <ButtonText className="text-base font-medium" style={{
                color: colors.text,
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