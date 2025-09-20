import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { TrendingUp, Star, Heart, Plus, Flame } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRTL } from '@/hooks/useRTL';
import { useTranslation } from 'react-i18next';
import Animated, { 
  FadeInUp, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TrendingProductsProps {
  onNavigate: (route: string) => void;
}

export default function TrendingProducts({ onNavigate }: TrendingProductsProps) {
  const { colors } = useTheme();
  const { isRTL, getFlexDirection } = useRTL();
  const { t } = useTranslation();

  const trendingProducts = [
    {
      id: 1,
      name: 'AirPods Pro Max',
      price: 399.99,
      originalPrice: 549.99,
      discount: 27,
      rating: 4.9,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      badge: 'Best Seller',
      badgeColor: colors.warning
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      price: 999.99,
      originalPrice: 1199.99,
      discount: 17,
      rating: 4.8,
      reviews: 1923,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      badge: 'New',
      badgeColor: colors.success
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      price: 1099.99,
      originalPrice: 1299.99,
      discount: 15,
      rating: 4.9,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      badge: 'Limited',
      badgeColor: colors.error
    }
  ];
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(1100)}
      style={{ paddingHorizontal: 20 }}
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Animated.View style={pulseAnimatedStyle}>
              <Icon as={TrendingUp} size="md" style={{ color: colors.warning, marginRight: 8 }} />
            </Animated.View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.text
            }}>
              {t('home.trendingNow')}
            </Text>
          </HStack>
          <View style={{
            backgroundColor: colors.warning + '20',
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Icon as={Flame} size="xs" style={{ color: colors.warning, marginRight: 4 }} />
            <Text style={{
              color: colors.warning,
              fontWeight: '600',
              fontSize: 12
            }}>{t('home.hot')}</Text>
          </View>
        </HStack>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 4, 
            paddingRight: isRTL ? 4 : 20,
            paddingLeft: isRTL ? 20 : 4
          }}
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <View style={{ flexDirection: getFlexDirection('row'), gap: 12 }}>
            {trendingProducts.map((product, index) => (
              <AnimatedPressable
                key={product.id}
                entering={FadeInRight.delay(1200 + index * 150)}
                onPress={() => onNavigate('/products')}
                style={{
                  width: 220,
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 20,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <View style={{ height: 160, backgroundColor: colors.backgroundSecondary }}>
                    <Image
                      source={{ uri: product.image }}
                      style={{ width: '100%', height: '100%' }}
                      alt={product.name}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Badges */}
                  <View style={{ position: 'absolute', top: 12, left: 12 }}>
                    <View style={{
                      backgroundColor: product.badgeColor,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4
                    }}>
                      <Text style={{
                        color: colors.textInverse,
                        fontWeight: 'bold',
                        fontSize: 12
                      }}>
                        {product.badge}
                      </Text>
                    </View>
                  </View>

                  <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <View style={{
                      backgroundColor: colors.error,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4
                    }}>
                      <Text style={{
                        color: colors.textInverse,
                        fontWeight: 'bold',
                        fontSize: 12
                      }}>
                        -{product.discount}%
                      </Text>
                    </View>
                  </View>

                  {/* Wishlist Button */}
                  <Pressable
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      backgroundColor: colors.surface + 'F0', // 95% opacity
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Icon as={Heart} size="sm" style={{ color: colors.textSecondary }} />
                  </Pressable>
                </View>

                <VStack style={{ padding: 16 }} space="sm">
                  <Text style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 16
                  }} numberOfLines={2}>
                    {product.name}
                  </Text>

                  <HStack className="items-center">
                    <Icon as={Star} size="xs" style={{ color: colors.warning, marginRight: 4 }} />
                    <Text style={{
                      color: colors.warning,
                      fontWeight: '600',
                      fontSize: 14,
                      marginRight: 8
                    }}>
                      {product.rating}
                    </Text>
                    <Text style={{
                      color: colors.textTertiary,
                      fontSize: 12
                    }}>
                      ({product.reviews.toLocaleString()})
                    </Text>
                  </HStack>

                  <HStack className="items-center justify-between">
                    <VStack>
                      <Text style={{
                        fontWeight: 'bold',
                        color: colors.primary,
                        fontSize: 18
                      }}>
                        ${product.price}
                      </Text>
                      <Text style={{
                        color: colors.textTertiary,
                        fontSize: 14,
                        textDecorationLine: 'line-through'
                      }}>
                        ${product.originalPrice}
                      </Text>
                    </VStack>

                    <Pressable
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: 12,
                        padding: 10,
                      }}
                    >
                      <Icon as={Plus} size="sm" style={{ color: colors.textInverse }} />
                    </Pressable>
                  </HStack>
                </VStack>
              </AnimatedPressable>
            ))}
          </View>
        </ScrollView>
      </VStack>
    </Animated.View>
  );
}
