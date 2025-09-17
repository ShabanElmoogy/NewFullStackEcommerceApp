import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions, InteractionManager } from 'react-native';
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
import { useTheme } from '@/hooks/useTheme';
import ProductCard from '@/components/products/productCard/ProductCard';
import SegmentedTabs, { TabItem } from '@/components/ui/tabs/SegmentedTabs';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryProductsSectionProps {
  onNavigate: (route: string) => void;
  onProductPress?: (productId: number) => void;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}

// Enhanced category configuration with theme-aware colors
const getCategoryConfig = (categoryName: string, isDark: boolean) => {
  const configs = {
    'Mobiles': {
      icon: Smartphone,
      light: { color: '#3B82F6', lightColor: '#DBEAFE' }, // Blue
      dark: { color: '#60A5FA', lightColor: '#1E3A8A' },
      emoji: '📱',
    },
    'Fashion': {
      icon: Shirt,
      light: { color: '#EC4899', lightColor: '#FCE7F3' }, // Pink
      dark: { color: '#F472B6', lightColor: '#831843' },
      emoji: '👕',
    },
    'Home': {
      icon: Home,
      light: { color: '#10B981', lightColor: '#D1FAE5' }, // Emerald
      dark: { color: '#34D399', lightColor: '#064E3B' },
      emoji: '🏠',
    },
    'Sports': {
      icon: Dumbbell,
      light: { color: '#F59E0B', lightColor: '#FEF3C7' }, // Amber
      dark: { color: '#FBBF24', lightColor: '#78350F' },
      emoji: '💪',
    },
    'Books': {
      icon: Book,
      light: { color: '#8B5CF6', lightColor: '#EDE9FE' }, // Violet
      dark: { color: '#A78BFA', lightColor: '#4C1D95' },
      emoji: '📚',
    },
    'Gaming': {
      icon: Gamepad2,
      light: { color: '#EF4444', lightColor: '#FEE2E2' }, // Red
      dark: { color: '#F87171', lightColor: '#7F1D1D' },
      emoji: '🎮',
    },
    'Electronics': {
      icon: Smartphone,
      light: { color: '#06B6D4', lightColor: '#CFFAFE' }, // Cyan
      dark: { color: '#22D3EE', lightColor: '#164E63' },
      emoji: '⚡',
    },
    'Beauty': {
      icon: Sparkles,
      light: { color: '#F97316', lightColor: '#FED7AA' }, // Orange
      dark: { color: '#FB923C', lightColor: '#9A3412' },
      emoji: '💄',
    },
    'default': {
      icon: Sparkles,
      light: { color: '#6B7280', lightColor: '#F3F4F6' }, // Gray
      dark: { color: '#9CA3AF', lightColor: '#374151' },
      emoji: '✨',
    },
  };

  const configKey = Object.keys(configs).find(key => 
    categoryName.toLowerCase().includes(key.toLowerCase())
  ) as keyof typeof configs;
  
  const config = configs[configKey] || configs.default;
  const themeColors = isDark ? config.dark : config.light;
  
  return {
    ...config,
    color: themeColors.color,
    lightColor: themeColors.lightColor,
  };
};

export default function CategoryProductsSection({ 
  onNavigate, 
}: CategoryProductsSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { language } = useLanguageStore();
  const { colors, isDark } = useTheme();
  const listRef = React.useRef<FlatList<any> | null>(null);
  
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

  // Handle category selection
  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };

  // Get products to display (filtered or trending)
  const productsToShow = selectedCategoryId ? filteredProducts : (allProducts?.slice(0, 8) || []);

  // Build category tabs once data is available (hook order preserved above guards)
  const categoryTabs: TabItem[] = React.useMemo(() => {
    const base: TabItem[] = [{ key: 'all', label: 'All', icon: Sparkles }];
    const list = (categories || []).filter((cat: any) => !cat.isDeleted);
    return base.concat(
      list.map((category: any) => {
        const name = getCategoryName(category);
        const cfg = getCategoryConfig(name, isDark);
        return { key: String(category.id), label: name, icon: cfg.icon } as TabItem;
      })
    );
  }, [categories, language, isDark]);

  const activeTabKey = selectedCategoryId === null ? 'all' : String(selectedCategoryId);

  // Reset list to start when active tab or data changes
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      try {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      } catch {}
    });
    return () => task.cancel();
  }, [activeTabKey, productsToShow.length]);

  
  if (categoriesLoading || productsLoading) {
    return (
      <Animated.View 
        entering={FadeInUp.delay(1000)}
        className="px-5"
      >
        <Animated.View style={[
          {
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            shadowColor: colors.primary,
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
              backgroundColor: colors.primary,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Icon as={Sparkles} size="xl" style={{ color: colors.textInverse }} />
            </View>
          </Animated.View>
          <Text style={{ color: colors.text, fontWeight: '600', fontSize: 18, marginBottom: 8 }}>
            Discovering Products
          </Text>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
            Finding the best deals just for you...
          </Text>
        </Animated.View>
      </Animated.View>
    );
  }

  
  return (
    <Animated.View
      entering={FadeInUp.delay(1000)}
    >
      <VStack space="xl">
        {/* Section Title */}
        <View className="px-5">
          <VStack space="sm">
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
              {selectedCategoryId ? 'Category Products' : 'Featured Products'}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {selectedCategoryId ? 'Discover products in this category' : 'Handpicked items just for you'}
            </Text>
          </VStack>
        </View>

        {/* Categories as Segmented Tabs */}
        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <SegmentedTabs
            tabs={categoryTabs}
            activeKey={activeTabKey}
            onChange={(key) => setSelectedCategoryId(key === 'all' ? null : parseInt(key))}
            scrollable
          />
        </View>

        {/* Enhanced Products Grid */}
        <View className="px-5">
          {productsToShow.length > 0 ? (
            <FlatList
              key={activeTabKey}
              ref={listRef}
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
                backgroundColor: colors.card,
                borderRadius: 24,
                padding: 40,
                alignItems: 'center',
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View style={{
                width: 80,
                height: 80,
                backgroundColor: colors.backgroundSecondary,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon as={Gift} size="xl" style={{ color: colors.textTertiary }} />
              </View>
              <Text style={{ 
                color: colors.text, 
                textAlign: 'center', 
                fontWeight: 'bold', 
                fontSize: 20, 
                marginBottom: 8,
                marginTop: 16 
              }}>
                {selectedCategoryId ? 'No products found' : 'No products available'}
              </Text>
              <Text style={{ 
                color: colors.textSecondary, 
                textAlign: 'center', 
                fontSize: 16 
              }}>
                {selectedCategoryId ? 'Try selecting a different category' : 'Check back later for new arrivals'}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Enhanced Show More Button */}
        {productsToShow.length > 0 && (
          <View style={{ alignItems: 'center' }}>
            <Pressable
              onPress={() => onNavigate('/products')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primary,
                borderRadius: 24,
                paddingVertical: 14,
                paddingHorizontal: 28,
                minWidth: 180,
                elevation: 2,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <Icon as={Sparkles} size="md" style={{ color: colors.textInverse, marginRight: 10 }} />
              <Text style={{ 
                color: colors.textInverse, 
                fontWeight: 'bold', 
                fontSize: 16, 
                letterSpacing: 0.5 
              }}>
                Explore All Products
              </Text>
            </Pressable>
          </View>
        )}
      </VStack>
    </Animated.View>
  );
}