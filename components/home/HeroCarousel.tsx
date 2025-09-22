import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import CarouselContainer from './hero-carousel/CarouselContainer';
import CarouselSlide from './hero-carousel/CarouselSlide';
import CarouselPagination from './hero-carousel/CarouselPagination';
import { HeroCarouselProps } from './hero-carousel/types';
import { defaultSlides } from './hero-carousel/data';

export default function HeroCarousel({
  onNavigate,
  slides = defaultSlides,
  autoSlideInterval = 4000,
  className,
}: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Ensure slides is always an array
  const safeSlides = Array.isArray(slides) && slides.length > 0 ? slides : defaultSlides || [];

  
  
  
  // Auto-slide effect
  useEffect(() => {
    if (safeSlides.length === 0) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % safeSlides.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [safeSlides.length, autoSlideInterval]);

  const goToSlide = (index: number) => setActiveSlide(index);

  const handleSlidePress = () => {
    onNavigate('/products');
  };

  // Get the current slide safely
  const currentSlide = safeSlides[activeSlide] || null;
  const isSparkleSlide = currentSlide?.icon === Sparkles;

  return (
    <CarouselContainer className={className}>
      <View className="mx-4" style={{ height: 220 }}>
        {currentSlide ? (
          <CarouselSlide
            key={`slide-${activeSlide}`}
            slide={currentSlide}
            onPress={handleSlidePress}
                        isSparkleSlide={isSparkleSlide}
          />
        ) : (
          <View style={{ height: 220, backgroundColor: '#f0f0f0', borderRadius: 24 }} />
        )}
      </View>

      <CarouselPagination
        totalSlides={safeSlides.length}
        activeSlide={activeSlide}
        onSlidePress={goToSlide}
      />
    </CarouselContainer>
  );
}