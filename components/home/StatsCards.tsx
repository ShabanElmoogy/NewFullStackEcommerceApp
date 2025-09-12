import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { ShoppingBag, Package, Scale } from 'lucide-react-native';
import Animated, { FadeInLeft, FadeInUp, FadeInRight } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(View);

interface StatsCardsProps {
  cartCount: number;
  compareCount: number;
  onNavigate: (route: string) => void;
}

export default function StatsCards({ cartCount, compareCount, onNavigate }: StatsCardsProps) {
  const statsData = [
    {
      title: 'In Cart',
      value: cartCount,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      icon: ShoppingBag,
      route: '/cart',
      animation: FadeInLeft.delay(200)
    },
    {
      title: 'Orders',
      value: 12,
      color: '#10B981',
      bgColor: '#F0FDF4',
      icon: Package,
      route: '/orders',
      animation: FadeInUp.delay(300)
    },
    {
      title: 'Compare',
      value: compareCount,
      color: '#F59E0B',
      bgColor: '#FEF3E2',
      icon: Scale,
      route: '/compare',
      animation: FadeInRight.delay(400)
    }
  ];

  return (
    <View className="px-5 mt-8">
      <HStack className="justify-between" space="sm">
        {statsData.map((stat, index) => (
          <AnimatedPressable
            key={stat.title}
            entering={stat.animation}
            style={{
              flex: 1,
              backgroundColor: stat.bgColor,
              borderRadius: 20,
              padding: 16,
              position: 'relative',
              marginHorizontal: index === 1 ? 3 : index === 0 ? 0 : 6,
              marginRight: index === 0 ? 6 : 0,
              marginLeft: index === 2 ? 6 : 0
            }}
          >
            <View style={{ position: 'absolute', top: 6, right: 6, opacity: 0.2, zIndex: 0, pointerEvents: 'none' }}>
              <Icon as={stat.icon} size="xl" style={{ color: stat.color, width: 36, height: 36 }} />
            </View>
            <HStack className="items-center justify-between">
              <VStack style={{ zIndex: 1 }}>
                <Text style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: stat.color 
                }}>
                  {stat.value}
                </Text>
                <Text className="text-xs text-gray-600 font-medium">
                  {stat.title}
                </Text>
              </VStack>
              
            </HStack>
          </AnimatedPressable>
        ))}
      </HStack>
    </View>
  );
}