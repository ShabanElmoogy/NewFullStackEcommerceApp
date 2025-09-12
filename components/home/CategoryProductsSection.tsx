import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions, ImageBackground } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Gamepad2,
  Sparkles,
  TrendingUp,
  Gift,
} from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  SlideInDown,
  interpolate
} from 'react-native-reanimated';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useLanguageStore } from '@/store/languageStore';
import ProductCard from '@/components/ProductCard';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryProductsSectionProps {
  onNavigate: (route: string) => void;
  onProductPress?: (productId: number) => void;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

// Enhanced category configuration with gradients and colors
const categoryConfig = {
  'Mobiles': { 
    icon: Smartphone, 
    gradient: ['#667eea', '#764ba2'], 
    color: '#667eea',
    bgColor: '#EEF2FF',
    emoji: '📱',
    lightColor: '#E0E7FF'
  },
  'Fashion': { 
    icon: Shirt, 
    gradient: ['#f093fb', '#f5576c'], 
    color: '#f093fb',
    bgColor: '#FDF2F8',
    emoji: '👕',
    lightColor: '#FCE7F3'
  },
  'Home': { 
    icon: Home, 
    gradient: ['#4facfe', '#00f2fe'], 
    color: '#4facfe',
    bgColor: '#EFF6FF',
    emoji: '🏠',
    lightColor: '#DBEAFE'
  },
  'Sports': { 
    icon: Dumbbell, 
    gradient: ['#43e97b', '#38f9d7'], 
    color: '#43e97b',
    bgColor: '#ECFDF5',
    emoji: '💪',
    lightColor: '#D1FAE5'
  },
  'Books': { 
    icon: Book, 
    gradient: ['#fa709a', '#fee140'], 
    color: '#fa709a',
    bgColor: '#FEF7CD',
    emoji: '📚',
    lightColor: '#FEF3C7'
  },
  'Gaming': { 
    icon: Gamepad2, 
    gradient: ['#a8edea', '#fed6e3'], 
    color: '#a8edea',
    bgColor: '#F0FDF4',
    emoji: '🎮',
    lightColor: '#DCFCE7'
  },
  'default': { 
    icon: Sparkles, 
    gradient: ['#667eea', '#764ba2'], 
    color: '#667eea',
    bgColor: '#F3F4F6',
    emoji: '✨',
    lightColor: '#F9FAFB'
  }
};

export default function CategoryProductsSection({ 
  onNavigate, 
}: CategoryProductsSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { language } = useLanguageStore();
  
  // Animation values
  const sparkleRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const headerGlow = useSharedValue(0);
  
  // Fetch categories and products
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  
  // Filter products by selected category
  const { filteredProducts } = useProductFilter(allProducts || [], {
    categories: selectedCategoryId ? [selectedCategoryId.toString()] : [],
    searchQuery: '',
    brands: [],
    minRating: 0,
    inStock: null,
    onSale: false,
    minPrice: '',
    maxPrice: '',
    sortBy: 'popularity'
  });

  useEffect(() => {
    // Sparkle rotation animation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );

    // Pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    // Header glow animation
    headerGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const headerGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(headerGlow.value, [0, 1], [0.12, 0.25]),
  }));

  // Get category name based on language
  const getCategoryName = (category: any) => {
    return language === 'ar' ? category.nameAr : category.nameEn;
  };

  // Get category configuration
  const getCategoryConfig = (categoryName: string) => {
    const configKey = Object.keys(categoryConfig).find(key => 
      categoryName.toLowerCase().includes(key.toLowerCase())
    );
    return categoryConfig[configKey as keyof typeof categoryConfig] || categoryConfig.default;
  };

  // Handle category selection
  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };

  // Get products to display (filtered or trending)
  const productsToShow = selectedCategoryId ? filteredProducts : (allProducts?.slice(0, 8) || []);

  if (categoriesLoading || productsLoading) {
    return (
      <Animated.View 
        entering={FadeInUp.delay(1000)}
        className="px-5 mt-8"
      >
        <Animated.View style={[
          {
            backgroundColor: 'white',
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            shadowColor: '#3B82F6',
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 10,
          },
          pulseAnimatedStyle
        ]}>
          <Animated.View style={sparkleAnimatedStyle}>
            <View style={{
              width: 60,
              height: 60,
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Icon as={Sparkles} size="xl" className="text-white" />
            </View>
          </Animated.View>
          <Text className="text-gray-700 font-semibold text-lg mb-2">Discovering Products</Text>
          <Text className="text-gray-500 text-center">Finding the best deals just for you...</Text>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(1000)}
      className="mt-8"
    >
      <VStack space="xl">
        {/* Section Title */}
        <View className="px-5">
          <VStack space="sm">
            <Text className="text-2xl font-bold text-typography-900">
              {selectedCategoryId ? 'Category Products' : 'Featured Products'}
            </Text>
            <Text className="text-typography-500">
              {selectedCategoryId ? 'Discover products in this category' : 'Handpicked items just for you'}
            </Text>
          </VStack>
        </View>

        {/* Categories Bar - simple pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <HStack className="py-3" space="md">
            {/* All chip */}
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 18,
                backgroundColor: selectedCategoryId === null ? '#E0EAFF' : '#F9FAFB',
                borderWidth: 1,
                borderColor: selectedCategoryId === null ? '#3B82F6' : '#E5E7EB',
              }}
            >
              <Text
                className="font-semibold"
                style={{ color: selectedCategoryId === null ? '#1D4ED8' : '#374151' }}
              >
                All
              </Text>
            </Pressable>

            {categories?.filter(cat => !cat.isDeleted).map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const config = getCategoryConfig(getCategoryName(category));
              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleCategoryPress(category.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 18,
                    backgroundColor: isSelected ? config.lightColor : '#F9FAFB',
                    borderWidth: 1,
                    borderColor: isSelected ? config.color : '#E5E7EB',
                  }}
                >
                  <HStack className="items-center" space="xs">
                    <Icon as={config.icon} size="sm" style={{ color: config.color }} />
                    <Text
                      className="font-semibold"
                      style={{ color: isSelected ? '#111827' : '#374151' }}
                      numberOfLines={1}
                    >
                      {getCategoryName(category)}
                    </Text>
                  </HStack>
                </Pressable>
              );
            })}
          </HStack>
        </ScrollView>

        {/* Enhanced Products Grid */}
        <View className="px-5">
          {productsToShow.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <HStack space="md">
                {productsToShow.map((product, index) => (
                  <View key={product.id} style={{ width: screenWidth - 56 }}>
                    <ProductCard product={product} viewMode="list" />
                  </View>
                ))}
              </HStack>
            </ScrollView>
          ) : (
            <Animated.View 
              entering={FadeInUp.delay(1400)}
              style={{
                backgroundColor: 'white',
                borderRadius: 24,
                padding: 40,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View style={{
                width: 80,
                height: 80,
                backgroundColor: '#F3F4F6',
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon as={Gift} size="xl" className="text-gray-400" />
              </View>
              <Text className="text-gray-700 text-center font-bold text-xl mb-2">
                {selectedCategoryId ? 'No products found' : 'No products available'}
              </Text>
              <Text className="text-gray-500 text-center text-base">
                {selectedCategoryId ? 'Try selecting a different category' : 'Check back later for new arrivals'}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Enhanced Show More Button */}
        {productsToShow.length > 0 && (
          <Animated.View 
            entering={SlideInDown.delay(1600)}
            className="px-5"
          >
            <Button
              onPress={() => onNavigate('/products')}
              className="bg-primary-600 rounded-xl py-10"
              size="lg"
            >
              <HStack className="items-center" space="md">
                <Icon as={Sparkles} size="md" className="text-white" />
                <ButtonText className="text-white font-bold text-lg">
                  Explore All Products
                </ButtonText>
                <Icon as={TrendingUp} size="md" className="text-white" />
              </HStack>
            </Button>
          </Animated.View>
        )}
      </VStack>
    </Animated.View>
  );
}