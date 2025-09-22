import React, { useState, useEffect } from 'react';
import { View, Pressable, Dimensions, InteractionManager } from 'react-native';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { FlatList } from 'react-native'
import { Sparkles, Gift } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useProductFilter } from '@/hooks/useProductFilter';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';
import ProductCard from '@/components/products/productCard/ProductCard';
import SegmentedTabs, { TabItem } from '@/components/ui/tabs/SegmentedTabs';
import { createCategoryTabs } from '@/utils/categoryUtils';
import AppLoader from '@/components/AppLoader';

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
  const { t } = useTranslation();
  const listRef = React.useRef<FlatList<any> | null>(null);
  
  // Fetch categories and products
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  
  // Normalize products shape
  const allProductsArray = Array.isArray(allProducts) ? allProducts : allProducts?.products ?? [];

  // Featured products and their categories
  const featuredProducts = React.useMemo(() =>
    (allProductsArray as any[]).filter((p: any) => p?.isFeature),
    [allProductsArray]
  );
  const featuredCategoryIds = React.useMemo(() =>
    new Set(featuredProducts.map((p: any) => String(p?.categoryId))),
    [featuredProducts]
  );
  
  // Filter products by selected category
  const { filteredProducts } = useProductFilter(allProductsArray, {
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

  // Only featured items for the selected category
  const featuredFilteredProducts = React.useMemo(() =>
    (filteredProducts as any[]).filter((p: any) => p?.isFeature),
    [filteredProducts]
  );

  // Get category name based on language
  const getCategoryName = (category: any) => {
    return language === 'ar' ? category.nameAr : category.nameEn;
  };

  // Handle category selection
  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };

  // Get products to display (featured when no category is selected)
  const productsToShow = selectedCategoryId ? featuredFilteredProducts : featuredProducts.slice(0, 8);

  // Build category tabs using the generic utility
  const categoryTabs: TabItem[] = React.useMemo(() => {
    if (!categories) return [];

    // Only categories that contain featured products
    const categoriesForFeatured = (categories as any[]).filter(
      (c: any) => featuredCategoryIds.has(String(c?.id))
    );
    
    return createCategoryTabs(
      categoriesForFeatured,
      colors,
      isDark,
      getCategoryName,
      (category) => String(category.id),
      t('home.all')
    );
  }, [categories, featuredCategoryIds, colors, isDark, language, t]);

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

  // Ensure selected category remains valid (must contain featured products)
  useEffect(() => {
    if (selectedCategoryId !== null && !featuredCategoryIds.has(String(selectedCategoryId))) {
      setSelectedCategoryId(null);
    }
  }, [selectedCategoryId, featuredCategoryIds]);

  
  if (categoriesLoading || productsLoading) {
    return (
      <AppLoader 
        message={t('products.loading.title')}
        subtitle={t('products.loading.subtitle')}
      />
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
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {selectedCategoryId ? t('home.categoryProducts') : t('home.featuredProducts')}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              {selectedCategoryId ? t('home.categoryProductsSubtitle') : t('home.featuredProductsSubtitle')}
            </Text>
          </VStack>
        </View>

        {/* Categories as Segmented Tabs */}
        <View className="mx-4 mb-2">
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
                <View 
                  className={isRTL ? "ml-4" : "mr-4"}
                  style={{ width: screenWidth - 56 }}
                >
                  <ProductCard product={item} viewMode="list" />
                </View>
              )}
            />
          ) : (
            <Animated.View 
              entering={FadeInUp.delay(1400)}
              className="rounded-3xl p-10 items-center shadow-lg"
              style={{
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View 
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.backgroundSecondary }}
              >
                <Icon as={Gift} size="xl" style={{ color: colors.textTertiary }} />
              </View>
              <Text 
                className="text-center font-bold text-xl mb-2 mt-4"
                style={{ color: colors.text }}
              >
                {selectedCategoryId ? t('products.empty.noResults') : t('products.empty.noProducts')}
              </Text>
              <Text 
                className="text-center text-base"
                style={{ color: colors.textSecondary }}
              >
                {selectedCategoryId ? t('home.tryDifferentCategory') : t('home.checkBackLater')}
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Enhanced Show More Button */}
        {productsToShow.length > 0 && (
          <View className="items-center">
            <Pressable
              onPress={() => {
                if (selectedCategoryId) {
                  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);
                  const categoryName = selectedCategory ? getCategoryName(selectedCategory) : '';
                  onNavigate(`/products?categoryId=${selectedCategoryId}&categoryName=${encodeURIComponent(categoryName)}`);
                } else {
                  onNavigate('/products');
                }
              }}
              className="flex-row items-center justify-center rounded-3xl py-3.5 px-7 min-w-[180px] shadow-md"
              style={{
                backgroundColor: colors.primary,
                elevation: 2,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              <Icon as={Sparkles} size="md" className="mr-2.5" style={{ color: colors.textInverse }} />
              <Text className="text-white font-bold text-base tracking-wide">
                {t('home.exploreAllProducts')}
              </Text>
            </Pressable>
          </View>
        )}
      </VStack>
    </Animated.View>
  );
}
