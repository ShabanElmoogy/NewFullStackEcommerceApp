import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Search, Grid3X3, Zap, Scale } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(View);

interface QuickActionsProps {
  compareCount: number;
}

export default function QuickActions({ compareCount }: QuickActionsProps) {
  const actions = [
    { 
      title: 'Search Products', 
      subtitle: 'Find anything', 
      icon: Search, 
      href: '/search', 
      color: '#10B981', 
      bgColor: '#ECFDF5' 
    },
    { 
      title: 'Categories', 
      subtitle: 'Browse by type', 
      icon: Grid3X3, 
      href: '/products', 
      color: '#3B82F6', 
      bgColor: '#EFF6FF' 
    },
    { 
      title: 'Flash Deals', 
      subtitle: 'Limited time', 
      icon: Zap, 
      href: '/products', 
      color: '#F59E0B', 
      bgColor: '#FFFBEB' 
    },
    { 
      title: 'Compare', 
      subtitle: `${compareCount} selected`, 
      icon: Scale, 
      href: '/compare', 
      color: '#8B5CF6', 
      bgColor: '#F3E8FF', 
      disabled: compareCount < 2, 
      badge: compareCount 
    }
  ];

  return (
    <Animated.View
      entering={FadeInUp.delay(600)}
      className="px-5 mt-8"
    >
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">
            Quick Actions
          </Text>
          <Badge className="bg-blue-50">
            <Icon as={Zap} size="xs" className="text-blue-600 mr-1" />
            <BadgeText className="text-blue-600 font-semibold">Fast</BadgeText>
          </Badge>
        </HStack>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {actions.map((action, index) => (
            <AnimatedPressable
              key={index}
              entering={FadeInUp.delay(700 + index * 100)}
              onPress={() => !action.disabled && router.push(action.href)}
              style={{
                width: (screenWidth - 52) / 2,
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
                opacity: action.disabled ? 0.6 : 1,
              }}
              disabled={action.disabled}
            >
              <VStack space="sm">
                <HStack className="items-center justify-between">
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      backgroundColor: action.bgColor,
                      borderRadius: 16,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon as={action.icon} size="lg" style={{ color: action.color }} />
                  </View>
                  
                  {action.badge && action.badge > 0 && (
                    <View className="bg-red-500 rounded-full px-2 py-1 min-w-6 items-center">
                      <Text className="text-white text-xs font-bold">
                        {action.badge}
                      </Text>
                    </View>
                  )}
                </HStack>
                
                <VStack>
                  <Text className="font-bold text-gray-900 text-base">
                    {action.title}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {action.subtitle}
                  </Text>
                </VStack>
              </VStack>
            </AnimatedPressable>
          ))}
        </View>
      </VStack>
    </Animated.View>
  );
}