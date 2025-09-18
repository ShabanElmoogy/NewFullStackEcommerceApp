import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Dimensions, InteractionManager } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { FlatList } from 'react-native'
import { Sparkles, Gift } from 'lucide-react-native';
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
import { createCategoryTabs } from '@/utils/categoryUtils';

const { width: screenWidth } = Dimensions.get('window');

interface CategoryProductsSectionProps {
  onNavigate: (route: string) => void;
  onProductPress?: (productId: number) => void;
  onAddToCart?: (product: any) => void;
  onAddToWishlist?: (product: any) => void;
}


export default function CategoryProductsSection({ 
  onNavigate, 
}: CategoryProductsSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { language, isRTL } = useLanguageStore();
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

  // Build category tabs using the generic utility
  const categoryTabs: TabItem[] = React.useMemo(() => {
    if (!categories) return [];
    
    return createCategoryTabs(
      categories,
      colors,
      isDark,
      getCategoryName,
      (category) => String(category.id)
    );
  }, [categories, colors, isDark, language]);

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
              key={`${activeTabKey}-${isRTL}`}
              ref={listRef}
              data={productsToShow}
              keyExtractor={item => item.id?.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              inverted={isRTL}
              contentContainerStyle={{ 
                paddingRight: isRTL ? 0 : 20,
                paddingLeft: isRTL ? 20 : 0
              }}
              renderItem={({ item }) => (
                <View style={{ 
                  width: screenWidth - 56, 
                  marginRight: isRTL ? 0 : 16,
                  marginLeft: isRTL ? 16 : 0
                }}>
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
                color: colors.text, 
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