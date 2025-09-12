import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ShoppingCart, Heart, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface HomeHeaderProps {
  greeting: {
    text: string;
    emoji: string;
    color: string;
  };
  cartCount: number;
  wishlistCount: number;
  onNavigate: (route: string) => void;
}

export default function HomeHeader({ greeting, cartCount, wishlistCount, onNavigate }: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={{
        backgroundColor: 'white',
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 8,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      {/* Top Bar */}
      <HStack className="items-center justify-between mb-6">
        <VStack>
          <HStack className="items-center">
            <Text style={{ color: greeting.color, fontSize: 14, fontWeight: '600' }}>
              {greeting.text} {greeting.emoji}
            </Text>
          </HStack>
          <Text className="text-2xl font-bold text-gray-900 mt-1">
            Ready to shop?
          </Text>
        </VStack>

        <HStack space="sm">
          <Pressable
            onPress={() => onNavigate('/cart')}
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#EFF6FF',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Icon as={ShoppingCart} size="md" className="text-blue-500" />
            {cartCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: '#3B82F6',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4
              }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                  {cartCount > 99 ? '99+' : cartCount.toString()}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => onNavigate('/wishlist')}
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#FEF2F2',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Icon as={Heart} size="md" className="text-red-500" />
            {wishlistCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: '#EF4444',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4
              }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                  {wishlistCount > 99 ? '99+' : wishlistCount.toString()}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => onNavigate('/profile')}
            style={{
              width: 44,
              height: 44,
              backgroundColor: '#EFF6FF',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon as={Crown} size="md" className="text-blue-600" />
          </Pressable>
        </HStack>
      </HStack>
    </Animated.View>
  );
}