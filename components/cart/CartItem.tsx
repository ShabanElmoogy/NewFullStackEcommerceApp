import React from 'react';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Trash2, Plus, Minus } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { CartItem as CartItemType } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: number, productName: string) => void;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
}

export function CartItem({ item, onRemove, onIncreaseQuantity, onDecreaseQuantity }: CartItemProps) {
  const { colors } = useTheme();
  
  // Calculate item totals
  const itemTotal = item.quantity * item.product.price;
  const formattedTotal = `$${itemTotal.toFixed(2)}`;
  const formattedUnitPrice = `$${item.product.price.toFixed(2)}`;

  return (
    <View className="rounded-xl p-4 mb-3 border shadow-sm" style={{
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    }}>
      <VStack space="md">
        <HStack space="md" className="items-start">
          {/* Product Image */}
          <View className="relative">
            <Image
              source={{ uri: item.product.image || 'https://via.placeholder.com/80x80?text=No+Image' }}
              className="w-20 h-20 rounded-lg"
              alt={item.product.name}
              resizeMode="cover"
            />
            <View className="absolute -top-2 -right-2 rounded-xl px-2 py-1 min-w-6 items-center" style={{
              backgroundColor: colors.primary,
            }}>
              <Text className="text-xs font-bold" style={{
                color: colors.textInverse,
              }}>
                {item.quantity}
              </Text>
            </View>
          </View>

          {/* Product Details */}
          <VStack className="flex-1" space="xs">
            <Heading size="sm" className="leading-5" style={{ color: colors.text }}>
              {item.product.name}
            </Heading>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {formattedUnitPrice} each
            </Text>
            <Text className="font-semibold" style={{ color: colors.primary }}>
              Total: {formattedTotal}
            </Text>
          </VStack>

          {/* Remove Button */}
          <Pressable
            onPress={() => onRemove(item.product.id, item.product.name)}
            className="p-2 rounded-full"
            style={{
              backgroundColor: colors.surfaceSecondary,
            }}
          >
            <Icon as={Trash2} size="sm" style={{ color: colors.error }} />
          </Pressable>
        </HStack>

        {/* Quantity Controls */}
        <HStack className="justify-between items-center">
          <Text className="font-medium" style={{ color: colors.textSecondary }}>Quantity:</Text>
          <View className="flex-row items-center rounded-lg p-1" style={{
            backgroundColor: colors.surfaceSecondary,
          }}>
            <Pressable
              onPress={() => onDecreaseQuantity(item.product.id)}
              className="w-8 h-8 rounded-md items-center justify-center border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: item.quantity <= 1 ? 0.5 : 1
              }}
              disabled={item.quantity <= 1}
            >
              <Icon
                as={Minus}
                size="xs"
                style={{
                  color: item.quantity <= 1 ? colors.textTertiary : colors.text
                }}
              />
            </Pressable>

            <Text className="min-w-10 text-center font-semibold mx-2" style={{
              color: colors.text,
            }}>
              {item.quantity}
            </Text>

            <Pressable
              onPress={() => onIncreaseQuantity(item.product.id)}
              className="w-8 h-8 rounded-md items-center justify-center border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border
              }}
            >
              <Icon as={Plus} size="xs" style={{ color: colors.text }} />
            </Pressable>
          </View>
        </HStack>
      </VStack>
    </View>
  );
}