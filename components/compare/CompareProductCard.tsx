import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { useTheme } from '@/hooks/useTheme';
import { Product } from '@/store/compareStore';
import { X, DollarSign, Crown, Star, ShoppingCart } from 'lucide-react-native';

export interface CompareProductCardProps {
  product: Product;
  isBestValue: boolean;
  isTopRated: boolean;
  onRemove: (id: number, name: string) => void;
  onAddToCart: (p: Product) => void;
}

export function CompareProductCard({ product, isBestValue, isTopRated, onRemove, onAddToCart }: CompareProductCardProps) {
  const { colors, isDark } = useTheme();
  return (
    <View
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: colors.card,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.1 : 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
      }}
    >
      <HStack>
        {/* Image + badges */}
        <View className="relative" style={{ width: 120, height: 120 }}>
          <Pressable
            onPress={() => onRemove(product.id, product.name)}
            className="absolute right-1.5 top-1.5 w-6 h-6 rounded-full items-center justify-center"
            style={{ zIndex: 10, backgroundColor: 'rgba(0,0,0,0.7)' }}
          >
            <Icon as={X} size="xs" style={{ color: 'white' }} />
          </Pressable>
          {isBestValue && (
            <View className="absolute left-1.5 top-1.5" style={{ zIndex: 10 }}>
              <View className="rounded-md flex-row items-center px-1 py-0.5" style={{ backgroundColor: colors.success }}>
                <Icon as={DollarSign} size="xs" style={{ color: 'white', marginRight: 1 }} />
                <Text className="font-semibold text-[8px]" style={{ color: 'white' }}>Best</Text>
              </View>
            </View>
          )}
          {isTopRated && !isBestValue && (
            <View className="absolute left-1.5 top-1.5" style={{ zIndex: 10 }}>
              <View className="rounded-md flex-row items-center px-1 py-0.5" style={{ backgroundColor: colors.warning }}>
                <Icon as={Crown} size="xs" style={{ color: 'white', marginRight: 1 }} />
                <Text className="font-semibold text-[8px]" style={{ color: 'white' }}>Top</Text>
              </View>
            </View>
          )}
          <View className="w-full h-full" style={{ backgroundColor: colors.surfaceSecondary }}>
            <Image
              source={{ uri: product.image || 'https://via.placeholder.com/300x300?text=No+Image' }}
              style={{ width: '100%', height: '100%' }}
              alt={product.name}
              resizeMode="contain"
            />
          </View>
          <View className="absolute left-1 bottom-1 flex-row" style={{ gap: 2 }}>
            {product.isNew && (
              <View className="rounded" style={{ backgroundColor: '#0EA5E9', paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text className="font-semibold text-[7px]" style={{ color: 'white' }}>NEW</Text>
              </View>
            )}
            {product.isTrending && (
              <View className="rounded" style={{ backgroundColor: '#FF6B35', paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text className="font-semibold text-[7px]" style={{ color: 'white' }}>HOT</Text>
              </View>
            )}
            {product.discount && (
              <View className="rounded" style={{ backgroundColor: colors.error, paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text className="font-semibold text-[7px]" style={{ color: 'white' }}>-{product.discount}%</Text>
              </View>
            )}
          </View>
        </View>
        {/* Info */}
        <VStack className="flex-1 p-3" space="xs">
          <Text className="font-semibold" style={{ color: colors.text, fontSize: 14, lineHeight: 18 }} numberOfLines={2}>{product.name}</Text>
          {product.brand && (<Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>by {product.brand}</Text>)}
          {product.rating && (
            <HStack className="items-center" space="xs">
              <Icon as={Star} size="xs" style={{ color: colors.warning }} />
              <Text className="font-semibold text-[11px]" style={{ color: colors.text }}>{product.rating.toFixed(1)}</Text>
              <Text className="text-[10px]" style={{ color: colors.textSecondary }}>({product.reviewCount || 0})</Text>
            </HStack>
          )}
          <View>
            {product.discount ? (
              <VStack space="xs">
                <HStack className="items-center" space="sm">
                  <Text className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </Text>
                  <Text className="line-through text-[11px]" style={{ color: colors.textTertiary }}>
                    ${product.price.toFixed(2)}
                  </Text>
                </HStack>
                <Text className="font-semibold text-[10px]" style={{ color: colors.success }}>
                  Save ${(product.price * (product.discount / 100)).toFixed(2)}
                </Text>
              </VStack>
            ) : (
              <Text className="font-bold" style={{ color: colors.primary, fontSize: 16 }}>${product.price.toFixed(2)}</Text>
            )}
          </View>
          {product.stock !== undefined && (
            <HStack className="items-center" space="xs">
              <View className="rounded-full" style={{ width: 6, height: 6, backgroundColor: product.stock > 10 ? colors.success : product.stock > 0 ? colors.warning : colors.error }} />
              <Text className="font-medium text-[10px]" style={{ color: product.stock > 10 ? colors.success : product.stock > 0 ? colors.warning : colors.error }}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
              </Text>
            </HStack>
          )}
        </VStack>
        {/* CTA */}
        <View className="justify-center pr-3">
          <Pressable
            onPress={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="rounded-lg flex-row items-center justify-center"
            style={{ backgroundColor: product.stock === 0 ? colors.surfaceTertiary : colors.primary, paddingVertical: 8, paddingHorizontal: 12, minWidth: 80 }}
          >
            <Icon as={ShoppingCart} size="xs" style={{ color: product.stock === 0 ? colors.textTertiary : 'white', marginRight: 4 }} />
            <Text className="font-semibold text-[11px]" style={{ color: product.stock === 0 ? colors.textTertiary : 'white' }}>{product.stock === 0 ? 'Out' : 'Add'}</Text>
          </Pressable>
        </View>
      </HStack>
    </View>
  );
}

export default CompareProductCard;
