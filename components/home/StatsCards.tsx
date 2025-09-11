import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ShoppingBag, Package, Scale } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInLeft, FadeInUp, FadeInRight } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(View);

interface StatsCardsProps {
  cartCount: number;
  compareCount: number;
}

export default function StatsCards({ cartCount, compareCount }: StatsCardsProps) {
  return (
    <HStack className="justify-between" space="sm" style={{ paddingHorizontal: 20 }}>
      <AnimatedPressable
        entering={FadeInLeft.delay(200)}
        onPress={() => router.push('/cart')}
        style={{
          flex: 1,
          backgroundColor: '#EFF6FF',
          borderRadius: 20,
          padding: 16,
          marginRight: 6
        }}
      >
        <HStack className="items-center justify-between">
          <VStack>
            <Text className="text-2xl font-bold text-blue-600">
              {cartCount}
            </Text>
            <Text className="text-xs text-gray-600 font-medium">
              In Cart
            </Text>
          </VStack>
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
            <Icon as={ShoppingBag} size="md" className="text-white" />
          </View>
        </HStack>
      </AnimatedPressable>

      <AnimatedPressable
        entering={FadeInUp.delay(300)}
        onPress={() => router.push('/orders')}
        style={{
          flex: 1,
          backgroundColor: '#F0FDF4',
          borderRadius: 20,
          padding: 16,
          marginHorizontal: 3
        }}
      >
        <HStack className="items-center justify-between">
          <VStack>
            <Text className="text-2xl font-bold text-green-600">
              12
            </Text>
            <Text className="text-xs text-gray-600 font-medium">
              Orders
            </Text>
          </VStack>
          <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
            <Icon as={Package} size="md" className="text-white" />
          </View>
        </HStack>
      </AnimatedPressable>

      <AnimatedPressable
        entering={FadeInRight.delay(400)}
        onPress={() => router.push('/compare')}
        style={{
          flex: 1,
          backgroundColor: '#FEF3E2',
          borderRadius: 20,
          padding: 16,
          marginLeft: 6
        }}
      >
        <HStack className="items-center justify-between">
          <VStack>
            <Text className="text-2xl font-bold text-orange-600">
              {compareCount}
            </Text>
            <Text className="text-xs text-gray-600 font-medium">
              Compare
            </Text>
          </VStack>
          <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
            <Icon as={Scale} size="md" className="text-white" />
          </View>
        </HStack>
      </AnimatedPressable>
    </HStack>
  );
}