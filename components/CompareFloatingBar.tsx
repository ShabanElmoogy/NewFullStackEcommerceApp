import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { useCompareStore } from '@/store/compareStore';
import { Scale, X, ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function CompareFloatingBar() {
  const { compareList, clearCompare, getCompareCount } = useCompareStore();
  const insets = useSafeAreaInsets();
  const compareCount = getCompareCount();
  const opacity = useSharedValue(compareCount > 0 ? 1 : 0);
  const translateY = useSharedValue(compareCount > 0 ? 0 : 100);

  React.useEffect(() => {
    if (compareCount > 0) {
      opacity.value = withTiming(1, { duration: 300 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(100, { duration: 200 });
    }
  }, [compareCount]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleCompare = () => {
    router.push('/compare');
  };

  const handleClear = () => {
    clearCompare();
  };

  if (compareCount === 0) {
    return null;
  }

  return (
    <AnimatedView
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: insets.bottom + 20,
          left: 16,
          right: 16,
          zIndex: 1000,
        }
      ]}
    >
      <View className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Icon as={Scale} size="md" className="text-blue-600" />
            </View>
            
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base">
                Compare Products
              </Text>
              <Text className="text-gray-500 text-sm">
                {compareCount} product{compareCount > 1 ? 's' : ''} selected
              </Text>
            </View>
          </HStack>

          <HStack className="items-center" space="sm">
            <Pressable
              onPress={handleClear}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Icon as={X} size="sm" className="text-gray-600" />
            </Pressable>

            <Button
              onPress={handleCompare}
              className="bg-blue-500 px-6 py-3 rounded-xl active:bg-blue-600"
              disabled={compareCount < 2}
            >
              <HStack className="items-center" space="xs">
                <ButtonText className="text-white font-semibold">
                  Compare
                </ButtonText>
                <Icon as={ArrowRight} size="sm" className="text-white" />
              </HStack>
            </Button>
          </HStack>
        </HStack>

        {/* Product thumbnails */}
        <HStack className="mt-3 space-x-2">
          {compareList.slice(0, 4).map((product, index) => (
            <View
              key={product.id}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Text className="text-xs font-bold text-gray-600">
                {product.name.charAt(0)}
              </Text>
            </View>
          ))}
          {compareCount > 4 && (
            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
              <Text className="text-xs font-bold text-blue-600">
                +{compareCount - 4}
              </Text>
            </View>
          )}
        </HStack>
      </View>
    </AnimatedView>
  );
}