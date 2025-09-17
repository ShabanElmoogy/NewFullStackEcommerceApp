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
    <View style={{ backgroundColor: colors.card, borderRadius: 12, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: isDark ? 0.1 : 0.05, shadowRadius: 4, elevation: 2, borderWidth: isDark ? 1 : 0, borderColor: colors.border, overflow: 'hidden' }}>
      <HStack>
        {/* Image + badges */}
        <View style={{ position: 'relative', width: 120, height: 120 }}>
          <Pressable onPress={() => onRemove(product.id, product.name)} style={{ position: 'absolute', top: 6, right: 6, zIndex: 10, width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Icon as={X} size="xs" style={{ color: 'white' }} />
          </Pressable>
          {isBestValue && (
            <View style={{ position: 'absolute', top: 6, left: 6, zIndex: 10 }}>
              <View style={{ backgroundColor: colors.success, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                <Icon as={DollarSign} size="xs" style={{ color: 'white', marginRight: 1 }} />
                <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>Best</Text>
              </View>
            </View>
          )}
          {isTopRated && !isBestValue && (
            <View style={{ position: 'absolute', top: 6, left: 6, zIndex: 10 }}>
              <View style={{ backgroundColor: colors.warning, borderRadius: 6, paddingHorizontal: 4, paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                <Icon as={Crown} size="xs" style={{ color: 'white', marginRight: 1 }} />
                <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>Top</Text>
              </View>
            </View>
          )}
          <View style={{ width: '100%', height: '100%', backgroundColor: colors.surfaceSecondary }}>
            <Image source={{ uri: product.image || 'https://via.placeholder.com/300x300?text=No+Image' }} style={{ width: '100%', height: '100%' }} alt={product.name} resizeMode="contain" />
          </View>
          <View style={{ position: 'absolute', bottom: 4, left: 4, flexDirection: 'row', gap: 2 }}>
            {product.isNew && (
              <View style={{ backgroundColor: '#0EA5E9', borderRadius: 4, paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>NEW</Text>
              </View>
            )}
            {product.isTrending && (
              <View style={{ backgroundColor: '#FF6B35', borderRadius: 4, paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>HOT</Text>
              </View>
            )}
            {product.discount && (
              <View style={{ backgroundColor: colors.error, borderRadius: 4, paddingHorizontal: 3, paddingVertical: 1 }}>
                <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>-{product.discount}%</Text>
              </View>
            )}
          </View>
        </View>
        {/* Info */}
        <VStack style={{ flex: 1, padding: 12 }} space="xs">
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', lineHeight: 18 }} numberOfLines={2}>{product.name}</Text>
          {product.brand && (<Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '500' }}>by {product.brand}</Text>)}
          {product.rating && (
            <HStack className="items-center" space="xs">
              <Icon as={Star} size="xs" style={{ color: colors.warning }} />
              <Text style={{ color: colors.text, fontSize: 11, fontWeight: '600' }}>{product.rating.toFixed(1)}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 10 }}>({product.reviewCount || 0})</Text>
            </HStack>
          )}
          <View>
            {product.discount ? (
              <VStack space="xs">
                <HStack className="items-center" space="sm">
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </Text>
                  <Text style={{ color: colors.textTertiary, fontSize: 11, textDecorationLine: 'line-through' }}>
                    ${product.price.toFixed(2)}
                  </Text>
                </HStack>
                <Text style={{ color: colors.success, fontSize: 10, fontWeight: '600' }}>
                  Save ${(product.price * (product.discount / 100)).toFixed(2)}
                </Text>
              </VStack>
            ) : (
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>${product.price.toFixed(2)}</Text>
            )}
          </View>
          {product.stock !== undefined && (
            <HStack className="items-center" space="xs">
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: product.stock > 10 ? colors.success : product.stock > 0 ? colors.warning : colors.error }} />
              <Text style={{ color: product.stock > 10 ? colors.success : product.stock > 0 ? colors.warning : colors.error, fontSize: 10, fontWeight: '500' }}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
              </Text>
            </HStack>
          )}
        </VStack>
        {/* CTA */}
        <View style={{ justifyContent: 'center', paddingRight: 12 }}>
          <Pressable onPress={() => onAddToCart(product)} disabled={product.stock === 0} style={{ backgroundColor: product.stock === 0 ? colors.surfaceTertiary : colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 80 }}>
            <Icon as={ShoppingCart} size="xs" style={{ color: product.stock === 0 ? colors.textTertiary : 'white', marginRight: 4 }} />
            <Text style={{ color: product.stock === 0 ? colors.textTertiary : 'white', fontSize: 11, fontWeight: '600' }}>{product.stock === 0 ? 'Out' : 'Add'}</Text>
          </Pressable>
        </View>
      </HStack>
    </View>
  );
}

export default CompareProductCard;
