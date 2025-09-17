import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';
import { Icon } from '../../ui/icon';
import { Heart } from 'lucide-react-native';
import { useWishlist } from '@/store/wishlistStore';

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
  };
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WishlistButton({ 
  product, 
  size = 'md'
}: WishlistButtonProps) {
  const { addProduct, removeProduct, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  // Animations
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(inWishlist ? 1 : 0);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#E5E7EB', '#EF4444']
    );

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      backgroundColor,
    } as ViewStyle;
  });

  const handleToggleWishlist = () => {
    // pop animation
    scale.value = withSequence(
      withSpring(inWishlist ? 0.9 : 1.2, { duration: 100 }),
      withSpring(1, { duration: 180 })
    );

    rotation.value = withSequence(
      withSpring(inWishlist ? -10 : 10, { duration: 100 }),
      withSpring(0, { duration: 180 })
    );

    // animate color
    colorProgress.value = withTiming(inWishlist ? 0 : 1, { duration: 300 });

    if (inWishlist) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm': return 'xs';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };

  return (
    <AnimatedPressable
      onPress={handleToggleWishlist}
      style={[animatedStyle, { 
        borderRadius: 999, 
        alignItems: 'center', 
        justifyContent: 'center',
        width: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
        height: size === 'sm' ? 32 : size === 'lg' ? 48 : 40,
      }]}
    >
      <Icon 
        as={Heart} 
        size={getSize()} 
        className={inWishlist ? 'text-white fill-current' : 'text-dark'} 
      />
    </AnimatedPressable>
  );
}
