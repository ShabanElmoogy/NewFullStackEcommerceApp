import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useCompareStore, Product } from '@/store/compareStore';
import { X, Trash2 } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

interface CompareRemoveButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  showText?: boolean;
  iconType?: 'x' | 'trash';
  onRemove?: (productId: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CompareRemoveButton({
  product,
  size = 'md',
  variant = 'icon',
  showText = false,
  iconType = 'x',
  onRemove
}: CompareRemoveButtonProps) {
  const { removeFromCompare, isInCompare } = useCompareStore();

  const isComparing = isInCompare(product.id);
  
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    } as ViewStyle;
  });

  const handlePress = () => {
    if (!isComparing) return;

    // Pop animation
    scale.value = withSequence(
      withSpring(0.8, { duration: 100 }),
      withSpring(1, { duration: 180 })
    );

    rotation.value = withSequence(
      withSpring(-10, { duration: 100 }),
      withSpring(0, { duration: 180 })
    );

    // Remove from compare
    removeFromCompare(product.id);
    
    // Show toast
    Toast.show({
      type: "success",
      text1: "✅ Removed from Compare",
      text2: `${product.name} removed from comparison`,
      visibilityTime: 2000,
    });

    // Call optional callback
    onRemove?.(product.id);
  };

  // Don't render if product is not in compare
  if (!isComparing) {
    return null;
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'xs' as const;
      case 'lg': return 'lg' as const;
      default: return 'md' as const;
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return { width: 28, height: 28 };
      case 'lg': return { width: 44, height: 44 };
      default: return { width: 36, height: 36 };
    }
  };

  const buttonSize = getButtonSize();
  const iconSize = getIconSize();
  const IconComponent = iconType === 'trash' ? Trash2 : X;

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
          backgroundColor: '#FEF2F2',
          borderWidth: 1,
          borderColor: '#FECACA',
        }]}
      >
        <Icon
          as={IconComponent}
          size={iconSize}
          className={`text-red-600 ${showText ? 'mr-2' : ''}`}
        />
        {showText && (
          <Text className={`
            font-medium text-red-600
            ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}
          `}>
            Remove
          </Text>
        )}
      </AnimatedPressable>
    );
  }

  // Icon variant
  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        animatedStyle,
        {
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FEF2F2',
          borderWidth: 1,
          borderColor: '#FECACA',
          ...buttonSize,
        }
      ]}
    >
      <Icon
        as={IconComponent}
        size={iconSize}
        className="text-red-600"
      />
    </AnimatedPressable>
  );
}