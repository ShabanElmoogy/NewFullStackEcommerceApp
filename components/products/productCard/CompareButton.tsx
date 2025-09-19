import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCompareStore, Product } from '@/store/compareStore';
import { Scale, Check } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import { Toast } from 'toastify-react-native'

interface CompareButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showText?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CompareButton({
  product,
  size = 'md',
  variant = 'icon',
  showText = false
}: CompareButtonProps) {
  const {
    addToCompare,
    removeFromCompare,
    isInCompare,
    canAddMore,
    getCompareCount
  } = useCompareStore();

  const isComparing = isInCompare(product.id);
  const canAdd = canAddMore();
  const compareCount = getCompareCount();
  const isMaxReached = compareCount >= 4;

  // Enhanced animations to match wishlist button
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue((isComparing || isMaxReached) ? 1 : 0);

  // Update color animation when compare state or max count changes
  React.useEffect(() => {
    colorProgress.value = withTiming((isComparing || isMaxReached) ? 1 : 0, { duration: 300 });
  }, [isComparing, isMaxReached]);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#E5E7EB', '#3B82F6'] // gray-300 to blue-500
    );

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      backgroundColor,
    } as ViewStyle;
  });

  const handlePress = () => {
    // Enhanced pop animation similar to wishlist button
    scale.value = withSequence(
      withSpring(isComparing ? 0.9 : 1.2, { duration: 100 }),
      withSpring(1, { duration: 180 })
    );

    rotation.value = withSequence(
      withSpring(isComparing ? -10 : 10, { duration: 100 }),
      withSpring(0, { duration: 180 })
    );

    // Animate color transition
    colorProgress.value = withTiming(isComparing ? 0 : 1, { duration: 300 });

    if (isComparing) {
      // Remove from compare
      removeFromCompare(product.id);
      Toast.show({
        type: "success",
        text1: "✅ Removed from Compare",
        text2: `${product.name} removed from comparison`,
        visibilityTime: 2000,
      });
    } else {
      // Check if we can add more items
      if (!canAdd) {
        Toast.show({
          type: "error",
          text1: "⚠️ Compare Limit",
          text2: "You cannot add more than 4 items to compare",
          visibilityTime: 3000,
        });
        return;
      }
      
      // Add to compare
      addToCompare(product);
      Toast.show({
        type: "success",
        text1: "✅ Added to Compare",
        text2: `${product.name} added to comparison`,
        visibilityTime: 2000,
      });
    }
  };

  // Match wishlist button sizing exactly
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'xs' as const;
      case 'lg': return 'lg' as const;
      default: return 'md' as const;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32 };
      case 'lg': return { width: 48, height: 48 };
      default: return { width: 40, height: 40 };
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();

  if (variant === 'button') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        style={[animatedStyle, {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isComparing ? '#DBEAFE' : '#E5E7EB',
        }]}
      >
        <Icon
          as={isComparing ? Check : Scale}
          size={iconSize}
          className={`
            ${isComparing ? 'text-white' : 'text-gray-700'}
            ${showText ? 'mr-2' : ''}
          `}
        />
        {showText && (
          <Text className={`
            font-medium
            ${isComparing ? 'text-white' : 'text-gray-700'}
            ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}
          `}>
            {isComparing ? 'Comparing' : 'Compare'}
          </Text>
        )}
      </AnimatedPressable>
    );
  }

  // Icon variant - matches wishlist button exactly
  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        animatedStyle,
        {
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          ...buttonSize,
        }
      ]}
    >
      <Icon
        as={isComparing ? Check : Scale}
        size={iconSize}
        className={isComparing ? 'text-white' : 'text-gray-700'}
      />

      {/* Enhanced compare count badge */}
      {compareCount > 0 && !isComparing && (
        <View
          className="absolute bg-blue-500 rounded-full items-center justify-center shadow-sm"
          style={{
            top: -4,
            right: -4,
            width: size === 'sm' ? 16 : 20,
            height: size === 'sm' ? 16 : 20,
          }}
        >
          <Text
            className="text-white font-bold"
            style={{
              fontSize: size === 'sm' ? 10 : 12,
            }}
          >
            {compareCount}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
