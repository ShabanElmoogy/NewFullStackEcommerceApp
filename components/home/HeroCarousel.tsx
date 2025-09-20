import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Sparkles } from 'lucide-react-native';
import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import CarouselContainer from './hero-carousel/CarouselContainer';
import CarouselSlide from './hero-carousel/CarouselSlide';
import CarouselPagination from './hero-carousel/CarouselPagination';
import { HeroCarouselProps } from './hero-carousel/types';
import { defaultSlides } from './hero-carousel/data';

export default function HeroCarousel({ 
  onNavigate, 
  slides = defaultSlides,
  autoSlideInterval = 4000,
  className 
}: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const sparkleScale = useSharedValue(1);

  // Decorative sparkle icon animation (does not affect layout positioning).
  // Loops between 1 and 1.3 scale. If you want to pause this on first open,
  // guard this effect with a flag (e.g., `if (disableInitialAnimation) return;`).
  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  // Auto slide: automatically advance slides every specified interval.
  // To pause on user interaction or visibility (e.g., screen out of focus),
  // add guards based on focus/visibility state.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [slides.length, autoSlideInterval]);

  // Jump to a specific slide (used by pagination dots).
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const handleSlidePress = () => {
    onNavigate('/products');
  };
  
  const currentSlide = slides[activeSlide];

  return (
    <CarouselContainer className={className}>
      {/* Single Slide Display */}
      <Box className="mx-4" style={{ height: 220 }}>
        <CarouselSlide
          key={`slide-${activeSlide}`}
          slide={currentSlide}
          onPress={handleSlidePress}
          sparkleAnimatedStyle={sparkleAnimatedStyle}
          isSparkleSlide={currentSlide.icon === Sparkles}
        />
      </Box>

      {/* Pagination Dots */}
      <CarouselPagination
        totalSlides={slides.length}
        activeSlide={activeSlide}
        onSlidePress={goToSlide}
      />
    </CarouselContainer>
  );
}