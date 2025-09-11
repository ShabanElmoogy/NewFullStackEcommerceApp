import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions, StatusBar } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { 
  TrendingUp, 
  Star, 
  ShoppingBag, 
  Heart,
  Scale,
  Gift,
  Zap,
  Crown,
  Store,
  ArrowRight,
  Percent,
  Clock,
  Users,
  Award,
  Truck,
  Shield,
  Headphones,
  ChevronRight,
  Tag,
  Sparkles,
  Search,
  Package,
  Bell,
  MapPin,
  Flame,
  ShoppingCart,
  Target,
  Smartphone,
  Home,
  Shirt,
  Gamepad2,
  Coffee,
  Music,
  Dumbbell,
  Book,
  Eye,
  Plus,
  Bookmark,
  Filter,
  Grid3X3,
  List,
  Layers
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { Link, router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  useAnimatedScrollHandler,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  SlideInDown,
  SlideInUp
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const cartCount = useCart((state) => state.totalQuantity());
  const wishlistCount = useWishlist((state) => state.totalItems());
  const compareCount = useCompareStore((state) => state.getCompareCount());

  // State for dynamic content
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState(0);

  // Animation values
  const sparkleScale = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Sparkle animation
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      true
    );

    return () => clearInterval(timer);
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '☀️', color: '#F59E0B' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️', color: '#3B82F6' };
    return { text: 'Good Evening', emoji: '🌙', color: '#8B5CF6' };
  };

  const greeting = getGreeting();

  const trendingProducts = [
    {
      id: 1,
      name: 'AirPods Pro Max',
      price: 399.99,
      originalPrice: 549.99,
      discount: 27,
      rating: 4.9,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      badge: 'Best Seller',
      badgeColor: '#F59E0B'
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      price: 999.99,
      originalPrice: 1199.99,
      discount: 17,
      rating: 4.8,
      reviews: 1923,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      badge: 'New',
      badgeColor: '#10B981'
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      price: 1099.99,
      originalPrice: 1299.99,
      discount: 15,
      rating: 4.9,
      reviews: 856,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      badge: 'Limited',
      badgeColor: '#EF4444'
    }
  ];

  const categories = [
    { name: 'Electronics', icon: Smartphone, color: '#3B82F6', items: '2.1k+', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' },
    { name: 'Fashion', icon: Shirt, color: '#EC4899', items: '1.8k+', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' },
    { name: 'Home & Living', icon: Home, color: '#10B981', items: '956+', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
    { name: 'Sports', icon: Dumbbell, color: '#F59E0B', items: '743+', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
    { name: 'Books', icon: Book, color: '#8B5CF6', items: '621+', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
    { name: 'Gaming', icon: Gamepad2, color: '#EF4444', items: '534+', image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&h=200&fit=crop' }
  ];

  const quickActions = [
    { title: 'Search Products', subtitle: 'Find anything', icon: Search, href: '/search', color: '#10B981', bgColor: '#ECFDF5' },
    { title: 'Categories', subtitle: 'Browse by type', icon: Grid3X3, href: '/products', color: '#3B82F6', bgColor: '#EFF6FF' },
    { title: 'Flash Deals', subtitle: 'Limited time', icon: Zap, href: '/products', color: '#F59E0B', bgColor: '#FFFBEB' },
    { title: 'Compare', subtitle: `${compareCount} selected`, icon: Scale, href: '/compare', color: '#8B5CF6', bgColor: '#F3E8FF', disabled: compareCount < 2, badge: compareCount }
  ];

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
        {/* Enhanced Header Section */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={{
            backgroundColor: 'white',
            paddingTop: insets.top + 15,
            paddingHorizontal: 20,
            paddingBottom: 25,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
            elevation: 8,
          }}
        >
          {/* Top Bar */}
          <HStack className="items-center justify-between mb-6">
            <VStack>
              <HStack className="items-center">
                <Text style={{ color: greeting.color, fontSize: 14, fontWeight: '600' }}>
                  {greeting.text} {greeting.emoji}
                </Text>
              </HStack>
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                Ready to shop?
              </Text>
            </VStack>
            
            <HStack space="sm">
              <Pressable
                onPress={() => router.push('/cart')}
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#EFF6FF',
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Icon as={ShoppingCart} size="md" className="text-blue-500" />
                {cartCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#3B82F6',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4
                  }}>
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                      {cartCount > 99 ? '99+' : cartCount.toString()}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.push('/wishlist')}
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#FEF2F2',
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Icon as={Heart} size="md" className="text-red-500" />
                {wishlistCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    backgroundColor: '#EF4444',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4
                  }}>
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                      {wishlistCount > 99 ? '99+' : wishlistCount.toString()}
                    </Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => router.push('/profile')}
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: '#EFF6FF',
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon as={Crown} size="md" className="text-blue-600" />
              </Pressable>
            </HStack>
          </HStack>

          {/* Search Bar */}
          <Pressable
            onPress={() => router.push('/search')}
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#E2E8F0'
            }}
          >
            <HStack className="items-center">
              <Icon as={Search} size="md" className="text-gray-400 mr-3" />
              <Text className="text-gray-500 flex-1">
                Search for products, brands...
              </Text>
              <Icon as={Filter} size="sm" className="text-gray-400" />
            </HStack>
          </Pressable>

          {/* Stats Cards */}
          <HStack className="justify-between" space="sm">
            <AnimatedPressable
              entering={FadeInLeft.delay(200)}
              onPress={() => router.push('/cart')}
              style={{
                flex: 1,
                backgroundColor: '#EFF6FF',
                borderRadius: 20,
                padding: 16,
                marginRight: 6
              }}
            >
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-2xl font-bold text-blue-600">
                    {cartCount}
                  </Text>
                  <Text className="text-xs text-gray-600 font-medium">
                    In Cart
                  </Text>
                </VStack>
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                  <Icon as={ShoppingBag} size="md" className="text-white" />
                </View>
              </HStack>
            </AnimatedPressable>

            <AnimatedPressable
              entering={FadeInUp.delay(300)}
              onPress={() => router.push('/orders')}
              style={{
                flex: 1,
                backgroundColor: '#F0FDF4',
                borderRadius: 20,
                padding: 16,
                marginHorizontal: 3
              }}
            >
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-2xl font-bold text-green-600">
                    12
                  </Text>
                  <Text className="text-xs text-gray-600 font-medium">
                    Orders
                  </Text>
                </VStack>
                <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
                  <Icon as={Package} size="md" className="text-white" />
                </View>
              </HStack>
            </AnimatedPressable>

            <AnimatedPressable
              entering={FadeInRight.delay(400)}
              onPress={() => router.push('/compare')}
              style={{
                flex: 1,
                backgroundColor: '#FEF3E2',
                borderRadius: 20,
                padding: 16,
                marginLeft: 6
              }}
            >
              <HStack className="items-center justify-between">
                <VStack>
                  <Text className="text-2xl font-bold text-orange-600">
                    {compareCount}
                  </Text>
                  <Text className="text-xs text-gray-600 font-medium">
                    Compare
                  </Text>
                </VStack>
                <View className="w-12 h-12 bg-orange-500 rounded-full items-center justify-center">
                  <Icon as={Scale} size="md" className="text-white" />
                </View>
              </HStack>
            </AnimatedPressable>
          </HStack>
        </Animated.View>

        {/* Hero Banner */}
        <Animated.View
          entering={FadeInUp.delay(500)}
          className="px-5 mt-6"
        >
          <View
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 24,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 180
            }}
          >
            {/* Animated Background Elements */}
            <Animated.View
              style={[
                sparkleAnimatedStyle,
                {
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  borderRadius: 60,
                }
              ]}
            />
            <View
              style={{
                position: 'absolute',
                bottom: -40,
                left: -40,
                width: 100,
                height: 100,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: 50,
              }}
            />

            <HStack className="items-center justify-between">
              <VStack className="flex-1">
                <HStack className="items-center mb-3">
                  <Animated.View style={sparkleAnimatedStyle}>
                    <Icon as={Sparkles} size="sm" className="text-yellow-400 mr-2" />
                  </Animated.View>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                    <BadgeText className="text-white font-bold text-xs">
                      MEGA SALE
                    </BadgeText>
                  </Badge>
                </HStack>
                
                <Text className="text-white font-bold text-3xl mb-2 leading-tight">
                  Up to 70% Off
                </Text>
                <Text className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Summer collection clearance. Limited time offer on premium brands!
                </Text>
                
                <Link href="/products" asChild>
                  <Button
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      alignSelf: 'flex-start'
                    }}
                  >
                    <HStack className="items-center">
                      <ButtonText style={{ color: '#1E293B', fontWeight: 'bold', marginRight: 8 }}>
                        Shop Now
                      </ButtonText>
                      <Icon as={ArrowRight} size="sm" style={{ color: '#1E293B' }} />
                    </HStack>
                  </Button>
                </Link>
              </VStack>

              <View className="w-28 h-28 bg-white/10 rounded-full items-center justify-center ml-4">
                <Icon as={Percent} size="xl" className="text-white" />
              </View>
            </HStack>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(600)}
          className="px-5 mt-8"
        >
          <VStack space="md">
            <HStack className="items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Quick Actions
              </Text>
              <Badge className="bg-blue-50">
                <Icon as={Zap} size="xs" className="text-blue-600 mr-1" />
                <BadgeText className="text-blue-600 font-semibold">Fast</BadgeText>
              </Badge>
            </HStack>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {quickActions.map((action, index) => (
                <AnimatedPressable
                  key={index}
                  entering={FadeInUp.delay(700 + index * 100)}
                  onPress={() => !action.disabled && router.push(action.href)}
                  style={{
                    width: (screenWidth - 52) / 2,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 4,
                    opacity: action.disabled ? 0.6 : 1,
                  }}
                  disabled={action.disabled}
                >
                  <VStack space="sm">
                    <HStack className="items-center justify-between">
                      <View
                        style={{
                          width: 52,
                          height: 52,
                          backgroundColor: action.bgColor,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon as={action.icon} size="lg" style={{ color: action.color }} />
                      </View>
                      
                      {action.badge && action.badge > 0 && (
                        <View className="bg-red-500 rounded-full px-2 py-1 min-w-6 items-center">
                          <Text className="text-white text-xs font-bold">
                            {action.badge}
                          </Text>
                        </View>
                      )}
                    </HStack>
                    
                    <VStack>
                      <Text className="font-bold text-gray-900 text-base">
                        {action.title}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {action.subtitle}
                      </Text>
                    </VStack>
                  </VStack>
                </AnimatedPressable>
              ))}
            </View>
          </VStack>
        </Animated.View>

        {/* Flash Sale */}
        <Animated.View
          entering={FadeInLeft.delay(800)}
          className="px-5 mt-8"
        >
          <View
            style={{
              backgroundColor: '#DC2626',
              borderRadius: 24,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Animated.View
              style={[
                pulseAnimatedStyle,
                {
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 50,
                }
              ]}
            />
            
            <HStack className="items-center justify-between">
              <VStack className="flex-1">
                <HStack className="items-center mb-2">
                  <Icon as={Flame} size="sm" className="text-yellow-300 mr-2" />
                  <Text className="text-red-200 font-semibold text-sm tracking-wide">
                    FLASH SALE
                  </Text>
                </HStack>
                
                <Text className="text-white font-bold text-2xl mb-2">
                  24 Hours Only!
                </Text>
                <Text className="text-red-100 text-sm mb-4">
                  Extra 25% off on electronics & gadgets
                </Text>
                
                <Link href="/products" asChild>
                  <Button className="bg-white self-start rounded-xl px-6 py-3">
                    <HStack className="items-center">
                      <ButtonText className="text-red-600 font-bold mr-2">
                        Shop Flash Sale
                      </ButtonText>
                      <Icon as={ArrowRight} size="sm" className="text-red-600" />
                    </HStack>
                  </Button>
                </Link>
              </VStack>

              <VStack className="items-center">
                <View className="w-20 h-20 bg-white/15 rounded-full items-center justify-center mb-3">
                  <Icon as={Clock} size="xl" className="text-white" />
                </View>
                <Text className="text-white font-bold text-sm">
                  23:45:12
                </Text>
                <Text className="text-red-200 text-xs">
                  remaining
                </Text>
              </VStack>
            </HStack>
          </View>
        </Animated.View>

        {/* Categories */}
        <Animated.View
          entering={FadeInUp.delay(900)}
          className="px-5 mt-8"
        >
          <VStack space="md">
            <HStack className="items-center justify-between">
              <Text className="text-xl font-bold text-gray-900">
                Shop by Category
              </Text>
              <Pressable onPress={() => router.push('/products')}>
                <HStack className="items-center">
                  <Text className="text-blue-600 font-semibold mr-1">
                    View All
                  </Text>
                  <Icon as={ChevronRight} size="sm" className="text-blue-600" />
                </HStack>
              </Pressable>
            </HStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md" className="px-1">
                {categories.map((category, index) => (
                  <AnimatedPressable
                    key={index}
                    entering={FadeInRight.delay(1000 + index * 100)}
                    onPress={() => router.push('/products')}
                    style={{
                      width: 140,
                      backgroundColor: 'white',
                      borderRadius: 20,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.1,
                      shadowRadius: 16,
                      elevation: 6,
                    }}
                  >
                    <View style={{ height: 90, backgroundColor: '#F8FAFC', position: 'relative' }}>
                      <Image
                        source={{ uri: category.image }}
                        style={{ width: '100%', height: '100%' }}
                        alt={category.name}
                        resizeMode="cover"
                      />
                      <View
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 28,
                          height: 28,
                          backgroundColor: category.color,
                          borderRadius: 14,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon as={category.icon} size="sm" className="text-white" />
                      </View>
                    </View>
                    
                    <VStack className="p-4">
                      <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                        {category.name}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-1">
                        {category.items} products
                      </Text>
                    </VStack>
                  </AnimatedPressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>
        </Animated.View>

        {/* Trending Products */}
        <Animated.View
          entering={FadeInUp.delay(1100)}
          className="px-5 mt-8"
        >
          <VStack space="md">
            <HStack className="items-center justify-between">
              <HStack className="items-center">
                <Animated.View style={pulseAnimatedStyle}>
                  <Icon as={TrendingUp} size="md" className="text-orange-500 mr-2" />
                </Animated.View>
                <Text className="text-xl font-bold text-gray-900">
                  Trending Now
                </Text>
              </HStack>
              <Badge className="bg-orange-50">
                <Icon as={Flame} size="xs" className="text-orange-600 mr-1" />
                <BadgeText className="text-orange-600 font-semibold">Hot</BadgeText>
              </Badge>
            </HStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md" className="px-1">
                {trendingProducts.map((product, index) => (
                  <AnimatedPressable
                    key={product.id}
                    entering={FadeInRight.delay(1200 + index * 150)}
                    onPress={() => router.push('/products')}
                    style={{
                      width: 220,
                      backgroundColor: 'white',
                      borderRadius: 20,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.12,
                      shadowRadius: 20,
                      elevation: 8,
                    }}
                  >
                    <View style={{ position: 'relative' }}>
                      <View style={{ height: 160, backgroundColor: '#F8FAFC' }}>
                        <Image
                          source={{ uri: product.image }}
                          style={{ width: '100%', height: '100%' }}
                          alt={product.name}
                          resizeMode="cover"
                        />
                      </View>
                      
                      {/* Badges */}
                      <View style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Badge style={{ backgroundColor: product.badgeColor }}>
                          <BadgeText className="text-white font-bold text-xs">
                            {product.badge}
                          </BadgeText>
                        </Badge>
                      </View>
                      
                      <View style={{ position: 'absolute', top: 12, right: 12 }}>
                        <Badge className="bg-red-500">
                          <BadgeText className="text-white font-bold text-xs">
                            -{product.discount}%
                          </BadgeText>
                        </Badge>
                      </View>

                      {/* Wishlist Button */}
                      <Pressable
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          width: 36,
                          height: 36,
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      >
                        <Icon as={Heart} size="sm" className="text-gray-600" />
                      </Pressable>
                    </View>
                    
                    <VStack className="p-4" space="sm">
                      <Text className="font-bold text-gray-900 text-base" numberOfLines={2}>
                        {product.name}
                      </Text>
                      
                      <HStack className="items-center">
                        <Icon as={Star} size="xs" className="text-yellow-500 fill-current mr-1" />
                        <Text className="text-yellow-600 font-semibold text-sm mr-2">
                          {product.rating}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                          ({product.reviews.toLocaleString()})
                        </Text>
                      </HStack>
                      
                      <HStack className="items-center justify-between">
                        <VStack>
                          <Text className="font-bold text-blue-600 text-lg">
                            ${product.price}
                          </Text>
                          <Text className="text-gray-400 text-sm line-through">
                            ${product.originalPrice}
                          </Text>
                        </VStack>
                        
                        <Pressable
                          style={{
                            backgroundColor: '#3B82F6',
                            borderRadius: 12,
                            padding: 10,
                          }}
                        >
                          <Icon as={Plus} size="sm" className="text-white" />
                        </Pressable>
                      </HStack>
                    </VStack>
                  </AnimatedPressable>
                ))}
              </HStack>
            </ScrollView>
          </VStack>
        </Animated.View>

        {/* Why Choose Us */}
        <Animated.View
          entering={FadeInUp.delay(1300)}
          className="px-5 mt-8"
        >
          <VStack space="md">
            <HStack className="items-center justify-center mb-2">
              <Icon as={Award} size="md" className="text-blue-600 mr-2" />
              <Text className="text-xl font-bold text-gray-900">
                Why Choose Us
              </Text>
            </HStack>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[
                { icon: Truck, title: 'Free Shipping', subtitle: 'Orders over $50', color: '#10B981' },
                { icon: Shield, title: 'Secure Payment', subtitle: '100% protected', color: '#3B82F6' },
                { icon: Headphones, title: '24/7 Support', subtitle: 'Always here', color: '#8B5CF6' },
                { icon: Award, title: 'Best Quality', subtitle: 'Premium only', color: '#F59E0B' },
              ].map((feature, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(1400 + index * 100)}
                  style={{
                    width: (screenWidth - 52) / 2,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <VStack space="sm" className="items-center">
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        backgroundColor: `${feature.color}15`,
                        borderRadius: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon as={feature.icon} size="lg" style={{ color: feature.color }} />
                    </View>
                    
                    <VStack className="items-center">
                      <Text className="font-bold text-gray-900 text-base text-center">
                        {feature.title}
                      </Text>
                      <Text className="text-gray-500 text-sm text-center">
                        {feature.subtitle}
                      </Text>
                    </VStack>
                  </VStack>
                </Animated.View>
              ))}
            </View>
          </VStack>
        </Animated.View>

        {/* App Statistics */}
        <Animated.View
          entering={FadeInUp.delay(1500)}
          className="px-5 mt-8"
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <VStack space="md">
              <HStack className="items-center justify-center mb-4">
                <Icon as={Target} size="lg" className="text-blue-600 mr-3" />
                <Text className="text-xl font-bold text-gray-900">
                  Our Impact
                </Text>
              </HStack>

              <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {[
                  { label: 'Happy Customers', value: '50K+', icon: Users, color: '#10B981' },
                  { label: 'Products', value: '100K+', icon: Package, color: '#3B82F6' },
                  { label: 'Countries', value: '25+', icon: MapPin, color: '#F59E0B' },
                  { label: 'Rating', value: '4.9★', icon: Star, color: '#EF4444' },
                ].map((stat, index) => (
                  <VStack key={index} className="items-center">
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        backgroundColor: `${stat.color}15`,
                        borderRadius: 26,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 8,
                      }}
                    >
                      <Icon as={stat.icon} size="md" style={{ color: stat.color }} />
                    </View>
                    <Text className="font-bold text-gray-900 text-lg">
                      {stat.value}
                    </Text>
                    <Text className="text-gray-500 text-xs text-center">
                      {stat.label}
                    </Text>
                  </VStack>
                ))}
              </View>
            </VStack>
          </View>
        </Animated.View>

        {/* Newsletter */}
        <Animated.View
          entering={SlideInUp.delay(1600)}
          className="px-5 mt-8"
        >
          <View
            style={{
              backgroundColor: '#1F2937',
              borderRadius: 24,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -60,
                right: -60,
                width: 160,
                height: 160,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: 80,
              }}
            />
            
            <VStack space="md">
              <HStack className="items-center mb-2">
                <Icon as={Bell} size="lg" className="text-blue-400 mr-3" />
                <Text className="text-white font-bold text-xl">
                  Stay in the Loop
                </Text>
              </HStack>
              
              <Text className="text-gray-300 text-sm mb-6 leading-relaxed">
                Get exclusive deals, new arrivals, and special offers delivered straight to your inbox.
              </Text>
              
              <HStack space="sm">
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                  }}
                >
                  <Text className="text-gray-400 text-sm">
                    Enter your email address
                  </Text>
                </View>
                
                <Button className="bg-blue-600 rounded-2xl px-8 py-3">
                  <ButtonText className="text-white font-semibold">
                    Subscribe
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}