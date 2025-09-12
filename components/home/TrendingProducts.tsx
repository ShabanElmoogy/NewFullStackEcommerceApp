import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { TrendingUp, Star, Heart, Plus, Flame } from 'lucide-react-native';
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
    badgeColor: '#F59E0B'
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
    badgeColor: '#10B981'
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
    badgeColor: '#EF4444'
  }
];

export default function TrendingProducts({ onNavigate }: TrendingProductsProps) {
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
      className="px-5 mt-8"
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Animated.View style={pulseAnimatedStyle}>
              <Icon as={TrendingUp} size="md" className="text-orange-500 mr-2" />
            </Animated.View>
            <Text className="text-xl font-bold text-gray-900">
              Trending Now
            </Text>
          </HStack>
          <Badge className="bg-orange-50">
            <Icon as={Flame} size="xs" className="text-orange-600 mr-1" />
            <BadgeText className="text-orange-600 font-semibold">Hot</BadgeText>
          </Badge>
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="md" className="px-1">
            {trendingProducts.map((product, index) => (
              <AnimatedPressable
                key={product.id}
                entering={FadeInRight.delay(1200 + index * 150)}
                onPress={() => onNavigate('/products')}
                style={{
                  width: 220,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <View style={{ height: 160, backgroundColor: '#F8FAFC' }}>
                    <Image
                      source={{ uri: product.image }}
                      style={{ width: '100%', height: '100%' }}
                      alt={product.name}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Badges */}
                  <View style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge style={{ backgroundColor: product.badgeColor }}>
                      <BadgeText className="text-white font-bold text-xs">
                        {product.badge}
                      </BadgeText>
                    </Badge>
                  </View>

                  <View style={{ position: 'absolute', top: 12, right: 12 }}>
                    <Badge className="bg-red-500">
                      <BadgeText className="text-white font-bold text-xs">
                        -{product.discount}%
                      </BadgeText>
                    </Badge>
                  </View>

                  {/* Wishlist Button */}
                  <Pressable
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Icon as={Heart} size="sm" className="text-gray-600" />
                  </Pressable>
                </View>

                <VStack className="p-4" space="sm">
                  <Text className="font-bold text-gray-900 text-base" numberOfLines={2}>
                    {product.name}
                  </Text>

                  <HStack className="items-center">
                    <Icon as={Star} size="xs" className="text-yellow-500 fill-current mr-1" />
                    <Text className="text-yellow-600 font-semibold text-sm mr-2">
                      {product.rating}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      ({product.reviews.toLocaleString()})
                    </Text>
                  </HStack>

                  <HStack className="items-center justify-between">
                    <VStack>
                      <Text className="font-bold text-blue-600 text-lg">
                        ${product.price}
                      </Text>
                      <Text className="text-gray-400 text-sm line-through">
                        ${product.originalPrice}
                      </Text>
                    </VStack>

                    <Pressable
                      style={{
                        backgroundColor: '#3B82F6',
                        borderRadius: 12,
                        padding: 10,
                      }}
                    >
                      <Icon as={Plus} size="sm" className="text-white" />
                    </Pressable>
                  </HStack>
                </VStack>
              </AnimatedPressable>
            ))}
          </HStack>
        </ScrollView>
      </VStack>
    </Animated.View>
  );
}