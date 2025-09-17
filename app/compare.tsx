import React, { useState, useMemo } from 'react';
import { View, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useCompareStore, Product } from '@/store/compareStore';
import { useCart } from '@/store/cartStore';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInRight, SlideOutRight, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';
import { VStack } from '@/components/ui/vstack';

import {
  CompareHeader,
  CompareTabs,
  CompareEmptyState,
  CompareQuickInsights,
  CompareProductCard,
  SpecsSection,
  FeaturesSection,
} from '@/components/compare';

const { width: screenWidth } = Dimensions.get('window');

export default function CompareScreen() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const addToCart = useCart((state) => state.addProduct);
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'features'>('overview');

  // Animation values
  const headerOpacity = useSharedValue(1);
  const tabScale = useSharedValue(1);

  const animatedHeaderStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));

  const handleBack = () => {
    try {
      if (router.canGoBack()) router.back();
      else router.push('/(tabs)');
    } catch {
      try { router.push('/(tabs)'); } catch {}
    }
  };

  const goToProducts = () => router.push('/products');

  const handleRemoveProduct = (productId: number, productName: string) => {
    removeFromCompare(productId);
    Toast.show({ type: 'success', text1: '🗑️ Product Removed', text2: `${productName} removed from comparison`, visibilityTime: 2000 });
    if (compareList.length <= 1) setTimeout(() => handleBack(), 500);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Toast.show({ type: 'success', text1: '🛒 Added to Cart', text2: `${product.name} added successfully`, visibilityTime: 2000 });
  };

  const handleClearAll = () => {
    clearCompare();
    Toast.show({ type: 'success', text1: '🧹 Comparison Cleared', text2: 'All products removed from comparison', visibilityTime: 2000 });
    setTimeout(() => handleBack(), 500);
  };

  // Derived insights
  const bestValue = useMemo(() => {
    if (compareList.length === 0) return null;
    return compareList.reduce((best, current) => {
      const currentPrice = current.discount ? current.price * (1 - current.discount / 100) : current.price;
      const bestPrice = best.discount ? best.price * (1 - best.discount / 100) : best.price;
      return currentPrice < bestPrice ? current : best;
    });
  }, [compareList]);

  const highestRated = useMemo(() => {
    if (compareList.length === 0) return null;
    return compareList.reduce((best, current) => ((current.rating || 0) > (best.rating || 0) ? current : best));
  }, [compareList]);

  // Specs and features keys
  const allSpecs = useMemo(() => {
    try {
      const specs = new Set<string>();
      compareList.forEach((p) => {
        if (p?.specifications && typeof p.specifications === 'object') {
          Object.keys(p.specifications).forEach((k) => specs.add(k));
        }
      });
      return Array.from(specs);
    } catch {
      return [];
    }
  }, [compareList]);

  const allFeatures = useMemo(() => {
    try {
      const features = new Set<string>();
      compareList.forEach((p) => {
        if (Array.isArray(p?.features)) p.features.forEach((f) => f && features.add(f));
      });
      return Array.from(features);
    } catch {
      return [];
    }
  }, [compareList]);

  if (compareList.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1 }}>
          <CompareEmptyState onBrowseProducts={goToProducts} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header + Tabs */}
      <Animated.View style={[animatedHeaderStyle]}>
        <View>
          <CompareHeader count={compareList.length} onBack={handleBack} onClearAll={handleClearAll} />
          <CompareTabs
            activeTab={activeTab}
            onChange={(k) => {
              setActiveTab(k);
              tabScale.value = withSequence(withTiming(0.95, { duration: 100 }), withTiming(1, { duration: 100 }));
            }}
          />
        </View>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} nestedScrollEnabled>
        {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ flex: 1, padding: 16 }}>
            <CompareQuickInsights bestValue={bestValue} highestRated={highestRated} />

            <VStack space="md">
              {compareList.map((product, index) => (
                <Animated.View key={product.id} entering={SlideInRight.delay(index * 100)} exiting={SlideOutRight}>
                  <CompareProductCard
                    product={product}
                    isBestValue={!!(bestValue && product.id === bestValue.id)}
                    isTopRated={!!(highestRated && product.id === highestRated.id && product.id !== bestValue?.id)}
                    onRemove={handleRemoveProduct}
                    onAddToCart={handleAddToCart}
                  />
                </Animated.View>
              ))}
            </VStack>
          </Animated.View>
        )}

        {activeTab === 'specs' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 16 }}>
            <SpecsSection allSpecs={allSpecs} compareList={compareList} />
          </Animated.View>
        )}

        {activeTab === 'features' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 16 }}>
            <FeaturesSection allFeatures={allFeatures} compareList={compareList} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
