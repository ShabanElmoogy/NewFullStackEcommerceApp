import React from 'react';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/useTheme';

interface CarouselPaginationProps {
  totalSlides: number;
  activeSlide: number;
  onSlidePress: (index: number) => void;
}

export default function CarouselPagination({ 
  totalSlides, 
  activeSlide, 
  onSlidePress 
}: CarouselPaginationProps) {
  const { colors } = useTheme();

  return (
    <HStack space="sm" className="justify-center mt-4 py-2 px-4">
      {Array.from({ length: totalSlides }).map((_, i) => (
        <Pressable
          key={i}
          onPress={() => onSlidePress(i)}
          className="active:scale-110 transition-transform duration-150"
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