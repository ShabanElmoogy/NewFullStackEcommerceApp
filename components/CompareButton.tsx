import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCompareStore, Product } from '@/store/compareStore';
import { Scale, Check } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence
} from 'react-native-reanimated';

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
  
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const isComparing = isInCompare(product.id);
  const canAdd = canAddMore();
  const compareCount = getCompareCount();

  const handlePress = () => {
    // Animate button
    scale.value = withSequence(
      withSpring(0.8, { duration: 100 }),
      withSpring(1, { duration: 200 })
    );
    
    rotation.value = withSequence(
      withSpring(15, { duration: 100 }),
      withSpring(0, { duration: 200 })
    );

    if (isComparing) {
      removeFromCompare(product.id);
      //TODO: Add Toast
      // toast.show({
      //   placement: "bottom",
      //   duration: 2000,
      //   render: ({ id }) => (
      //     <CustomToast 
      //       id={id} 
      //       message={`${product.name} removed from comparison`}
      //     />
      //   ),
      // });
    } else {
      if (!canAdd) {
          //TODO: Add Toast
        // toast.show({
        //   placement: "bottom",
        //   duration: 3000,
        //   render: ({ id }) => (
        //     <CustomToast 
        //       id={id} 
        //       message="Maximum 4 products can be compared. Remove one to add another."
        //     />
        //   ),
        // });
        return;
      }

      addToCompare(product);
        //TODO: Add Toast
      // toast.show({
      //   placement: "bottom",
      //   duration: 2000,
      //   render: ({ id }) => (
      //     <CustomToast 
      //       id={id} 
      //       message={`${product.name} added to comparison (${compareCount + 1}/4)`}
      //     />
      //   ),
      // });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-8 h-8',
          icon: 'xs' as const,
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'w-12 h-12',
          icon: 'md' as const,
          text: 'text-base',
        };
      default:
        return {
          container: 'w-10 h-10',
          icon: 'sm' as const,
          text: 'text-sm',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  if (variant === 'button') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        style={animatedStyle}
        className={`
          flex-row items-center justify-center px-3 py-2 rounded-lg border
          ${isComparing 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-gray-50 border-gray-200'
          }
          active:scale-95
        `}
      >
        <Icon 
          as={isComparing ? Check : Scale} 
          size={sizeStyles.icon}
          className={`
            ${isComparing ? 'text-blue-600' : 'text-gray-600'}
            ${showText ? 'mr-2' : ''}
          `}
        />
        {showText && (
          <Text className={`
            font-medium
            ${isComparing ? 'text-blue-600' : 'text-gray-600'}
            ${sizeStyles.text}
          `}>
            {isComparing ? 'Comparing' : 'Compare'}
          </Text>
        )}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={animatedStyle}
      className={`
        ${sizeStyles.container}
        rounded-full items-center justify-center
        ${isComparing 
          ? 'bg-blue-500 shadow-lg shadow-blue-500/25' 
          : 'bg-white/90 border border-gray-200'
        }
        active:scale-95
      `}
    >
      <Icon 
        as={isComparing ? Check : Scale} 
        size={sizeStyles.icon}
        className={isComparing ? 'text-white' : 'text-gray-700'}
      />
      
      {/* Compare count badge */}
      {compareCount > 0 && !isComparing && (
        <View className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {compareCount}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}