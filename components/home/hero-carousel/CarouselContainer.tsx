import React from 'react';
import { Box } from '@/components/ui/box';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface CarouselContainerProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function CarouselContainer({ children, className }: CarouselContainerProps) {
  const { colors } = useTheme();

  return (
    <AnimatedBox 
      entering={FadeInUp.delay(300)} 
      className={`mt-6 w-full ${className || ''}`}
      style={{ backgroundColor: 'transparent' }}
    >
      {children}
    </AnimatedBox>
  );
}