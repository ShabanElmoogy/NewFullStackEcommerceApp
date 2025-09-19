import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Flame, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { 
  FadeInLeft, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated';

interface FlashSaleProps {
  onNavigate: (route: string) => void;
}

export default function FlashSale({ onNavigate }: FlashSaleProps) {
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
      entering={FadeInLeft.delay(800)}
      className="px-5 mt-8"
    >
      <View
        style={{
          backgroundColor: '#DC2626',
          borderRadius: 24,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={[
            pulseAnimatedStyle,
            {
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 50,
            }
          ]}
        />

        <HStack className="items-center justify-between">
          <VStack className="flex-1">
            <HStack className="items-center mb-2">
              <Icon as={Flame} size="sm" className="text-yellow-300 mr-2" />
              <Text className="text-red-200 font-semibold text-sm tracking-wide">
                FLASH SALE
              </Text>
            </HStack>

            <Text className="text-white font-bold text-2xl mb-2">
              24 Hours Only!
            </Text>
            <Text className="text-red-100 text-sm mb-4">
              Extra 25% off on electronics & gadgets
            </Text>

            <Pressable
              onPress={() => onNavigate('/products')}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                paddingHorizontal: 24,
                paddingVertical: 12,
                alignSelf: 'flex-start'
              }}
            >
              <HStack className="items-center">
                <Text style={{ color: '#DC2626', fontWeight: 'bold', marginRight: 8 }}>
                  Shop Flash Sale
                </Text>
                <Icon as={ArrowRight} size="sm" className="text-red-600" />
              </HStack>
            </Pressable>
          </VStack>

          <VStack className="items-center">
            <View className="w-20 h-20 bg-white/15 rounded-full items-center justify-center mb-3">
              <Icon as={Clock} size="xl" className="text-white" />
            </View>
            <Text className="text-white font-bold text-sm">
              23:45:12
            </Text>
            <Text className="text-red-200 text-xs">
              remaining
            </Text>
          </VStack>
        </HStack>
      </View>
    </Animated.View>
  );
}
