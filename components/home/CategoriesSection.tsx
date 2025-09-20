import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { ChevronRight, Smartphone, Shirt, Home, Dumbbell, Book, Gamepad2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useRTL } from '@/hooks/useRTL';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoriesSectionProps {
  onNavigate: (route: string) => void;
}

export default function CategoriesSection({ onNavigate }: CategoriesSectionProps) {
  const { colors } = useTheme();
  const { isRTL, getFlexDirection } = useRTL();
  const { t } = useTranslation();

  const categories = [
    { name: 'Electronics', icon: Smartphone, color: colors.primary, items: '2.1k+', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' },
    { name: 'Fashion', icon: Shirt, color: colors.error, items: '1.8k+', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' },
    { name: 'Home & Living', icon: Home, color: colors.success, items: '956+', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
    { name: 'Sports', icon: Dumbbell, color: colors.warning, items: '743+', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
    { name: 'Books', icon: Book, color: colors.info, items: '621+', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
    { name: 'Gaming', icon: Gamepad2, color: colors.error, items: '534+', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop' }
  ];

  return (
    <Animated.View
      entering={FadeInUp.delay(900)}
      style={{ paddingHorizontal: 20}}
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text
          }}>
            {t('home.categories')}
          </Text>
          <Pressable onPress={() => onNavigate('/products')}>
            <HStack className="items-center">
              <Text style={{
                color: colors.primary,
                fontWeight: '600',
                marginRight: 4
              }}>
                {t('home.viewAll')}
              </Text>
              <Icon as={ChevronRight} size="sm" style={{ color: colors.primary }} />
            </HStack>
          </Pressable>
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
            {categories.map((category, index) => (
              <AnimatedPressable
                key={index}
                entering={FadeInRight.delay(1000 + index * 100)}
                onPress={() => onNavigate('/products')}
                style={{
                  width: 140,
                  backgroundColor: colors.surface,
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.1,
                  shadowRadius: 16,
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ 
                  height: 90, 
                  backgroundColor: colors.backgroundSecondary, 
                  position: 'relative' 
                }}>
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
                    <Icon as={category.icon} size="sm" style={{ color: colors.textInverse }} />
                  </View>
                </View>

                <VStack style={{ padding: 16 }}>
                  <Text style={{
                    fontWeight: 'bold',
                    color: colors.text,
                    fontSize: 14
                  }} numberOfLines={1}>
                    {category.name}
                  </Text>
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    marginTop: 4
                  }}>
                    {category.items} products
                  </Text>
                </VStack>
              </AnimatedPressable>
            ))}
          </View>
        </ScrollView>
      </VStack>
    </Animated.View>
  );
}
