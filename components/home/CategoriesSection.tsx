import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { ChevronRight, Smartphone, Shirt, Home, Dumbbell, Book, Gamepad2 } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoriesSectionProps {
  onNavigate: (route: string) => void;
}

const categories = [
  { name: 'Electronics', icon: Smartphone, color: '#3B82F6', items: '2.1k+', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' },
  { name: 'Fashion', icon: Shirt, color: '#EC4899', items: '1.8k+', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' },
  { name: 'Home & Living', icon: Home, color: '#10B981', items: '956+', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
  { name: 'Sports', icon: Dumbbell, color: '#F59E0B', items: '743+', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
  { name: 'Books', icon: Book, color: '#8B5CF6', items: '621+', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
  { name: 'Gaming', icon: Gamepad2, color: '#EF4444', items: '534+', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop' }
];

export default function CategoriesSection({ onNavigate }: CategoriesSectionProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(900)}
      className="px-5 mt-8"
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">
            Shop by Category
          </Text>
          <Pressable onPress={() => onNavigate('/products')}>
            <HStack className="items-center">
              <Text className="text-blue-600 font-semibold mr-1">
                View All
              </Text>
              <Icon as={ChevronRight} size="sm" className="text-blue-600" />
            </HStack>
          </Pressable>
        </HStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="md" className="px-1">
            {categories.map((category, index) => (
              <AnimatedPressable
                key={index}
                entering={FadeInRight.delay(1000 + index * 100)}
                onPress={() => onNavigate('/products')}
                style={{
                  width: 140,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 6,
                }}
              >
                <View style={{ height: 90, backgroundColor: '#F8FAFC', position: 'relative' }}>
                  <Image
                    source={{ uri: category.image }}
                    style={{ width: '100%', height: '100%' }}
                    alt={category.name}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      backgroundColor: category.color,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon as={category.icon} size="sm" className="text-white" />
                  </View>
                </View>

                <VStack className="p-4">
                  <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {category.items} products
                  </Text>
                </VStack>
              </AnimatedPressable>
            ))}
          </HStack>
        </ScrollView>
      </VStack>
    </Animated.View>
  );
}