import React from 'react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/useTheme';

interface CarouselPaginationProps {
  totalSlides: number;
  activeSlide: number;
  onSlidePress: (index: number) => void;
  className?: string;
}

export default function CarouselPagination({ 
  totalSlides, 
  activeSlide, 
  onSlidePress,
  className = '' 
}: CarouselPaginationProps) {
  const { colors } = useTheme();

  // Don't render pagination if there's only one slide
  if (totalSlides <= 1) {
    return null;
  }

  return (
    <HStack space="sm" className={`justify-center mt-4 py-2 px-4 ${className}`}>
      {Array.from({ length: totalSlides }, (_, i) => (
        <Pressable
          key={i}
          onPress={() => onSlidePress(i)}
          className="active:scale-110 transition-transform duration-150"
          accessibilityLabel={`Go to slide ${i + 1}`}
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Box
            className={`h-2 rounded-full mx-1 transition-all duration-300 ${
              activeSlide === i ? 'w-5' : 'w-2'
            }`}
            style={{
              backgroundColor: activeSlide === i ? colors.primary : colors.border,
              shadowColor: activeSlide === i ? colors.primary : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeSlide === i ? 0.3 : 0,
              shadowRadius: 2,
              elevation: activeSlide === i ? 2 : 0,
            }}
          />
        </Pressable>
      ))}
    </HStack>
  );
}