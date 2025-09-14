import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StatusBar } from 'react-native';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

// Import separate components
// import HomeHeader from './components/home/HomeHeader';
import SearchBar from '../../components/home/SearchBar';
import HeroCarousel from '../../components/home/HeroCarousel';
import CategoriesSection from '../../components/home/CategoriesSection';
import CategoryProductsSection from '../../components/home/CategoryProductsSection';
import TrendingProducts from '../../components/home/TrendingProducts';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import AppStatistics from '../../components/home/AppStatistics';
import Newsletter from '../../components/home/Newsletter';

interface HomePageProps {
  onNavigate?: (route: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  // Optimized store subscriptions to prevent unnecessary re-renders
  const cartCount = useCart((state) => state.totalQuantity());
  const wishlistCount = useWishlist((state) => state.totalItems());
  // const compareCount = useCompareStore((state) => state.getCompareCount());
  const { colors, isDark } = useTheme();

  // State for dynamic content
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firstOpen, setFirstOpen] = useState(true);

  // Animation values
  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Mark first open complete after first paint cycle
    const id = setTimeout(() => setFirstOpen(false), 0);

    return () => {
      clearInterval(timer);
      clearTimeout(id);
    };
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Memoized navigation handler to prevent re-creation on every render
  const handleNavigation = useCallback((route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
  }, [onNavigate]);

  // Memoized greeting calculation
  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️', color: '#F59E0B' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', color: '#3B82F6' };
    return { text: 'Good Evening', emoji: '🌙', color: '#8B5CF6' };
  }, [currentTime]);

  // Memoized callback functions to prevent child re-renders
  const handleAddToCart = useCallback((product: any) => {
    console.log('Add to cart:', product);
  }, []);

  const handleAddToWishlist = useCallback((product: any) => {
    console.log('Add to wishlist:', product);
  }, []);

  const handleProductPress = useCallback((productId: number) => {
    handleNavigation(`/product/${productId}`);
  }, [handleNavigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* GlobalHeader now renders the home header content */}

        <SearchBar onNavigate={handleNavigation} />

        <HeroCarousel onNavigate={handleNavigation} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20, marginHorizontal: 16 }} />

        {/* <FlashSale onNavigate={handleNavigation} /> */}

        <CategoriesSection onNavigate={handleNavigation} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 20, marginHorizontal: 16 }} />

        <CategoryProductsSection 
          onNavigate={handleNavigation}
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16, marginHorizontal: 16 }} />

        <TrendingProducts onNavigate={handleNavigation} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16, marginHorizontal: 16 }} />

        <WhyChooseUs />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16, marginHorizontal: 16 }} />

        <AppStatistics />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16, marginHorizontal: 16 }} />

        <Newsletter disableInitialAnimation={firstOpen} />
      </Animated.ScrollView>
    </View>
  );
}