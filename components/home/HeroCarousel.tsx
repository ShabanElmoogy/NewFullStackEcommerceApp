import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Sparkles, Star, Crown } from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  FadeIn,
  FadeOut,
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming
} from 'react-native-reanimated';

interface HeroCarouselProps {
  onNavigate: (route: string) => void;
}

const slides = [
  {
    id: '1',
    title: 'Summer Sale',
    subtitle: 'Up to 70% Off',
    description: 'Get the best deals on fashion items',
    buttonText: 'Shop Now',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center'
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
    description: 'Discover the latest trends',
    buttonText: 'Explore',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop&crop=center'
  },
  {
    id: '3',
    title: 'Tech Deals',
    subtitle: 'Smart Savings',
    description: 'Latest gadgets at best prices',
    buttonText: 'Browse',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop&crop=center'
  }
];

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function HeroCarousel({ onNavigate }: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const sparkleScale = useSharedValue(1);

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

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const currentSlide = slides[activeSlide];

  return (
    <AnimatedBox entering={FadeInUp.delay(300)} className="mt-6">
      {/* Single Slide Display */}
      <Box className="mx-4" style={{ height: 220 }}>
        <AnimatedBox
          key={`slide-${activeSlide}`}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(300)}
        >
          <Pressable
            onPress={() => onNavigate('/products')}
            className="w-full h-full rounded-3xl overflow-hidden bg-black"
            style={{ height: 220 }}
          >
            <Image
              source={{ uri: currentSlide.image }}
              className="w-full h-full absolute"
              resizeMode="cover"
              alt={currentSlide.title}
            />

            <Box className="flex-1 p-5 justify-end" 
                 style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
              
              {/* Icon */}
              <Box 
                className="absolute top-5 left-5 rounded-full p-2.5"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                {currentSlide.icon === Sparkles ? (
                  <Animated.View style={sparkleAnimatedStyle}>
                    <Icon as={currentSlide.icon} size="xl" className="text-white" />
                  </Animated.View>
                ) : (
                  <Icon as={currentSlide.icon} size="xl" className="text-white" />
                )}
              </Box>

              {/* Content */}
              <VStack space="xs">
                <Text className="text-white text-3xl font-bold">
                  {currentSlide.title}
                </Text>
                <Text className="text-white text-lg font-semibold">
                  {currentSlide.subtitle}
                </Text>
                <Text className="text-gray-100 text-sm mb-3">
                  {currentSlide.description}
                </Text>

                <Pressable
                  onPress={() => onNavigate('/products')}
                  className="bg-white px-5 py-2.5 rounded-full self-start"
                >
                  <Text className="font-bold text-gray-800">
                    {currentSlide.buttonText}
                  </Text>
                </Pressable>
              </VStack>
            </Box>
          </Pressable>
        </AnimatedBox>
      </Box>

      {/* Pagination Dots */}
      <HStack space="sm" className="justify-center mt-3 py-2">
        {slides.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => goToSlide(i)}
          >
            <Box
              className={`h-2 rounded-sm mx-1 ${
                activeSlide === i 
                  ? 'w-5 bg-blue-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          </Pressable>
        ))}
      </HStack>
    </AnimatedBox>
  );
}