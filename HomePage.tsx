import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { router } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

// Import separate components
import HomeHeader from './components/home/HomeHeader';
import HeroCarousel from './components/home/HeroCarousel';
import FlashSale from './components/home/FlashSale';
import StatsCards from './components/home/StatsCards';
import CategoriesSection from './components/home/CategoriesSection';
import TrendingProducts from './components/home/TrendingProducts';
import WhyChooseUs from './components/home/WhyChooseUs';
import AppStatistics from './components/home/AppStatistics';
import Newsletter from './components/home/Newsletter';

interface HomePageProps {
  onNavigate?: (route: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const cartCount = useCart((state) => state.totalQuantity());
  const wishlistCount = useWishlist((state) => state.totalItems());
  const compareCount = useCompareStore((state) => state.getCompareCount());

  // State for dynamic content
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation values
  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Navigation handler
  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️', color: '#F59E0B' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', color: '#3B82F6' };
    return { text: 'Good Evening', emoji: '🌙', color: '#8B5CF6' };
  };

  const greeting = getGreeting();

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <HomeHeader
          greeting={greeting}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          onNavigate={handleNavigation}
        />

                <StatsCards
          cartCount={cartCount}
          compareCount={compareCount}
          onNavigate={handleNavigation}
        />

        <HeroCarousel onNavigate={handleNavigation} />

        <FlashSale onNavigate={handleNavigation} />



        <CategoriesSection onNavigate={handleNavigation} />

        <TrendingProducts onNavigate={handleNavigation} />

        <WhyChooseUs />

        <AppStatistics />

        <Newsletter />
      </Animated.ScrollView>
    </View>
  );
}