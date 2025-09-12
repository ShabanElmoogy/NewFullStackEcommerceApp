import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { FlatList } from 'react-native'
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  Book, 
  Gamepad2,
  Sparkles,
  Gift,
} from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
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

// Enhanced category configuration with gradients and colorss
const categoryConfig = {
  'Mobiles': {
    icon: Smartphone,
    gradient: ['#667eea', '#764ba2'],
    color: '#667eea',
    bgColor: '#EEF2FF',
    emoji: '📱',
    lightColor: '#E0E7FF',
  },
  'Fashion': {
    icon: Shirt,
    gradient: ['#f093fb', '#f5576c'],
    color: '#f093fb',
    bgColor: '#FDF2F8',
    emoji: '👕',
    lightColor: '#FCE7F3',
  },
  'Home': {
    icon: Home,
    gradient: ['#4facfe', '#00f2fe'],
    color: '#4facfe',
    bgColor: '#EFF6FF',
    emoji: '🏠',
    lightColor: '#DBEAFE',
  },
  'Sports': {
    icon: Dumbbell,
    gradient: ['#43e97b', '#38f9d7'],
    color: '#43e97b',
    bgColor: '#ECFDF5',
    emoji: '💪',
    lightColor: '#D1FAE5',
  },
  'Books': {
    icon: Book,
    gradient: ['#fa709a', '#fee140'],
    color: '#fa709a',
    bgColor: '#FEF7CD',
    emoji: '📚',
    lightColor: '#FEF3C7',
  },
  'Gaming': {
    icon: Gamepad2,
    gradient: ['#a8edea', '#fed6e3'],
    color: '#a8edea',
    bgColor: '#F0FDF4',
    emoji: '🎮',
    lightColor: '#DCFCE7',
  },
  'default': {
    icon: Sparkles,
    gradient: ['#667eea', '#764ba2'],
    color: '#667eea',
    bgColor: '#F3F4F6',
    emoji: '✨',
    lightColor: '#F9FAFB',
  },
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

        {/* All badges in one bordered bar, each badge is an icon with its own color */}
        <View
          style={{
            borderWidth: 2,
            borderColor: '#E5E7EB',
            borderRadius: 32,
            marginHorizontal: 16,
            marginBottom: 8,
            overflow: 'hidden',
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 }}
          >
          {/* All icon badge */}
          <Pressable
            onPress={() => setSelectedCategoryId(null)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 14,
              height: 44,
              borderRadius: 22,
              backgroundColor: selectedCategoryId === null ? categoryConfig['Mobiles'].color : categoryConfig['Mobiles'].lightColor,
              marginRight: 8,
              opacity: selectedCategoryId === null ? 1 : 0.92,
            }}
          >
            <Icon as={Sparkles} size="md" style={{ color: selectedCategoryId === null ? '#fff' : categoryConfig['Mobiles'].color, marginRight: 6 }} />
            <Text style={{ color: selectedCategoryId === null ? '#fff' : categoryConfig['Mobiles'].color, fontWeight: '600', fontSize: 15 }}>All</Text>
          </Pressable>

          {categories?.filter(cat => !cat.isDeleted).map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const config = getCategoryConfig(getCategoryName(category));
            return (
              <Pressable
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 14,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isSelected ? config.color : config.lightColor,
                  marginRight: 8,
                  opacity: isSelected ? 1 : 0.92,
                }}
              >
                <Icon as={config.icon} size="md" style={{ color: isSelected ? '#fff' : config.color, marginRight: 6 }} />
                <Text style={{ color: isSelected ? '#fff' : config.color, fontWeight: '600', fontSize: 15 }}>{getCategoryName(category)}</Text>
              </Pressable>
            );
          })}
          </ScrollView>
        </View>

        {/* Enhanced Products Grid */}
        <View className="px-5">
          {productsToShow.length > 0 ? (
            <FlatList
              data={productsToShow}
              keyExtractor={item => item.id?.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              renderItem={({ item }) => (
                <View style={{ width: screenWidth - 56, marginRight: 16 }}>
                  <ProductCard product={item} viewMode="list" />
                </View>
              )}
            />
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
          <View style={{ alignItems: 'center', marginTop: 16 }}>
            <Pressable
              onPress={() => onNavigate('/products')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3B82F6',
                borderRadius: 24,
                paddingVertical: 14,
                paddingHorizontal: 28,
                minWidth: 180,
                elevation: 2,
              }}
            >
              <Icon as={Sparkles} size="md" style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 }}>
                Explore All Products
              </Text>
            </Pressable>
          </View>
        )}
      </VStack>
    </Animated.View>
  );
}