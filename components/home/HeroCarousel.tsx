import React, { useState } from 'react';
import { View, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Sparkles, Star, Crown } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const heroSlides = [
  {
    id: 1,
    title: 'Summer Sale',
    subtitle: 'Up to 70% Off',
    description: 'Get the best deals on fashion items',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center',
    buttonText: 'Shop Now',
    icon: Sparkles,
  },
  {
    id: 2,
    title: 'New Arrivals',
    subtitle: 'Fresh Collection',
    description: 'Discover the latest trends',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop&crop=center',
    buttonText: 'Explore',
    icon: Star,
  },
  {
    id: 3,
    title: 'Tech Deals',
    subtitle: 'Smart Savings',
    description: 'Latest gadgets at best prices',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=600&fit=crop&crop=center',
    buttonText: 'Browse',
    icon: Crown,
  },
];

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const sparkleScale = useSharedValue(1);

  React.useEffect(() => {
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

  const renderSlide = (slide: typeof heroSlides[0], index: number) => (
    <View key={slide.id} style={{ width: screenWidth, paddingHorizontal: 16 }}>
      <Pressable
        onPress={() => router.push('/products')}
        style={{
          width: screenWidth - 32,
          height: 220,
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <Image
          source={{ uri: slide.image }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 24,
          justifyContent: 'flex-end'
        }}>
          {/* Icon Badge */}
          <View style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 25,
            padding: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)'
          }}>
            {index === 0 ? (
              <Animated.View style={sparkleAnimatedStyle}>
                <Icon as={slide.icon} size="lg" className="text-white" />
              </Animated.View>
            ) : (
              <Icon as={slide.icon} size="lg" className="text-white" />
            )}
          </View>

          {/* Content */}
          <VStack style={{ gap: 8 }}>
            <Text style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4
            }}>
              {slide.title}
            </Text>
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: '600',
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2
            }}>
              {slide.subtitle}
            </Text>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 14,
              marginBottom: 16,
              textShadowColor: 'rgba(0, 0, 0, 0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2
            }}>
              {slide.description}
            </Text>

            {/* CTA Button */}
            <Pressable
              style={{
                backgroundColor: 'white',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 25,
                alignSelf: 'flex-start',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4
              }}
            >
              <Text style={{
                color: '#1F2937',
                fontWeight: 'bold',
                fontSize: 16
              }}>
                {slide.buttonText}
              </Text>
            </Pressable>
          </VStack>
        </View>
      </Pressable>
    </View>
  );

  return (
    <Animated.View
      entering={FadeInUp.delay(500)}
      style={{ marginTop: 24, marginBottom: 24 }}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideWidth = screenWidth;
          const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
          setActiveSlide(index);
        }}
        style={{ width: screenWidth }}
      >
        {heroSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>
      
      {/* Pagination Dots */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginTop: 16,
        gap: 8
      }}>
        {heroSlides.map((_, index) => (
          <Animated.View
            key={index}
            style={{
              width: activeSlide === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeSlide === index ? '#3B82F6' : '#D1D5DB',
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}