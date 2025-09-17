import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Pressable, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { useCompareStore, Product } from '@/store/compareStore';
import { useCart } from '@/store/cartStore';
import { useTheme } from '@/hooks/useTheme';

import { 
  ArrowLeft, 
  X, 
  Star, 
  ShoppingCart, 
  Check,
  Award,
  DollarSign,
  Info,
  AlertTriangle,
  Crown,
  TrendingUp,
  Package,
  Zap,
  Shield,
  Heart,
  Share2,
  MoreVertical
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  SlideInRight, 
  SlideOutRight,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

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

  const handleBack = () => {
    try {
      // Check if we can go back to the previous screen
      if (router.canGoBack()) {
        router.back();
        console.log("go back")
      } else {
        // If no previous screen, go to home tab
        router.push('/(tabs)');
        console.log("go error")

      }
    } catch (error) {
      console.warn('Navigation error:', error);
      // Fallback to home screen
      try {
        router.push('/(tabs)');
      } catch (fallbackError) {
        console.warn('Fallback navigation error:', fallbackError);
      }
    }
  };

  const handleRemoveProduct = (productId: number, productName: string) => {
    removeFromCompare(productId);
    Toast.show({
      type: "success",
      text1: "🗑️ Product Removed",
      text2: `${productName} removed from comparison`,
      visibilityTime: 2000,
    });
    
    if (compareList.length <= 1) {
      setTimeout(() => handleBack(), 500);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Toast.show({
      type: "success",
      text1: "🛒 Added to Cart",
      text2: `${product.name} added successfully`,
      visibilityTime: 2000,
    });
  };

  const handleClearAll = () => {
    clearCompare();
    Toast.show({
      type: "success",
      text1: "🧹 Comparison Cleared",
      text2: "All products removed from comparison",
      visibilityTime: 2000,
    });
    setTimeout(() => handleBack(), 500);
  };

  // Get best value product (lowest price)
  const getBestValue = () => {
    if (compareList.length === 0) return null;
    return compareList.reduce((best, current) => {
      const currentPrice = current.discount 
        ? current.price * (1 - current.discount / 100) 
        : current.price;
      const bestPrice = best.discount 
        ? best.price * (1 - best.discount / 100) 
        : best.price;
      return currentPrice < bestPrice ? current : best;
    });
  };

  // Get highest rated product
  const getHighestRated = () => {
    if (compareList.length === 0) return null;
    return compareList.reduce((best, current) => {
      return (current.rating || 0) > (best.rating || 0) ? current : best;
    });
  };

  // Get all unique specifications
  const allSpecs = React.useMemo(() => {
    try {
      const specs = new Set<string>();
      if (Array.isArray(compareList) && compareList.length > 0) {
        compareList.forEach(product => {
          if (product && product.specifications && typeof product.specifications === 'object') {
            Object.keys(product.specifications).forEach(key => {
              if (key && typeof key === 'string') {
                specs.add(key);
              }
            });
          }
        });
      }
      return Array.from(specs);
    } catch (error) {
      console.warn('Error processing specifications:', error);
      return [];
    }
  }, [compareList]);

  // Get all unique features
  const allFeatures = React.useMemo(() => {
    try {
      const features = new Set<string>();
      if (Array.isArray(compareList) && compareList.length > 0) {
        compareList.forEach(product => {
          if (product && Array.isArray(product.features)) {
            product.features.forEach(feature => {
              if (feature && typeof feature === 'string') {
                features.add(feature);
              }
            });
          }
        });
      }
      return Array.from(features);
    } catch (error) {
      console.warn('Error processing features:', error);
      return [];
    }
  }, [compareList]);

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  if (compareList.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar 
          barStyle={isDark ? "light-content" : "dark-content"} 
          backgroundColor={colors.background} 
        />
        
        <Animated.View 
          entering={FadeIn.duration(600)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View 
            style={{
              backgroundColor: colors.card,
              borderRadius: 24,
              padding: 32,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 16,
              elevation: 8,
              alignItems: 'center',
              maxWidth: 320,
              width: '100%',
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
            }}
          >
            <View 
              style={{
                width: 80,
                height: 80,
                backgroundColor: colors.primary + '15',
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Icon as={Package} size="xl" style={{ color: colors.primary }} />
            </View>
            
            <Text 
              style={{ 
                color: colors.text,
                fontSize: 24,
                fontWeight: '700',
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              No Products to Compare
            </Text>
            
            <Text 
              style={{ 
                color: colors.textSecondary,
                fontSize: 16,
                marginBottom: 24,
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Add products to comparison from the products page to see detailed side-by-side comparisons
            </Text>
            
            <Pressable
              onPress={handleBack}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 16,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text 
                style={{ 
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Browse Products
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  }

  const bestValue = getBestValue();
  const highestRated = getHighestRated();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />
      
      {/* Enhanced Header */}
      <Animated.View 
        style={[
          animatedHeaderStyle,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.1,
            shadowRadius: 8,
            elevation: 4,
            borderBottomWidth: isDark ? 1 : 0,
            borderBottomColor: colors.border,
          }
        ]}
      >
        <View style={{ paddingTop: insets.top, paddingHorizontal: 16, paddingBottom: 16 }}>
          <HStack className="items-center justify-between mb-4">
            <HStack className="items-center" space="md">
              <Pressable
                onPress={handleBack}
                style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 22,
                  backgroundColor: colors.surfaceSecondary,
                }}
              >
                <Icon as={ArrowLeft} size="md" style={{ color: colors.text }} />
              </Pressable>
              
              <VStack>
                <Text 
                  style={{ 
                    color: colors.text,
                    fontSize: 22,
                    fontWeight: '700',
                  }}
                >
                  Product Comparison
                </Text>
                <Text 
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: 14,
                  }}
                >
                  Compare {compareList.length} products side by side
                </Text>
              </VStack>
            </HStack>

            <Pressable
              onPress={handleClearAll}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: colors.error + '15',
                borderWidth: 1,
                borderColor: colors.error + '30',
              }}
            >
              <Text 
                style={{ 
                  color: colors.error,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Clear All
              </Text>
            </Pressable>
          </HStack>

          {/* Tab Navigation */}
          <View 
            style={{
              backgroundColor: colors.surfaceSecondary,
              borderRadius: 12,
              padding: 4,
              flexDirection: 'row',
            }}
          >
            {[
              { key: 'overview', label: 'Overview', icon: Award },
              { key: 'specs', label: 'Specifications', icon: Info },
              { key: 'features', label: 'Features', icon: Check }
            ].map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => {
                  setActiveTab(tab.key as any);
                  tabScale.value = withSequence(
                    withTiming(0.95, { duration: 100 }),
                    withTiming(1, { duration: 100 })
                  );
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: activeTab === tab.key ? colors.card : 'transparent',
                  shadowColor: activeTab === tab.key ? colors.shadow : 'transparent',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: activeTab === tab.key ? (isDark ? 0.2 : 0.1) : 0,
                  shadowRadius: 4,
                  elevation: activeTab === tab.key ? 2 : 0,
                }}
              >
                <Icon 
                  as={tab.icon} 
                  size="sm" 
                  style={{ 
                    color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                    marginRight: 8,
                  }} 
                />
                <Text 
                  style={{
                    color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                    fontSize: 14,
                    fontWeight: activeTab === tab.key ? '600' : '500',
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        nestedScrollEnabled={true}
      >
        {activeTab === 'overview' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ flex: 1, padding: 16 }}>
            {/* Quick Insights */}
            {bestValue && highestRated && (
              <View 
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.1 : 0.05,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                }}
              >
                <HStack className="items-center mb-3">
                  <Icon as={TrendingUp} size="md" style={{ color: colors.primary, marginRight: 8 }} />
                  <Text 
                    style={{ 
                      color: colors.text,
                      fontSize: 18,
                      fontWeight: '600',
                    }}
                  >
                    Quick Insights
                  </Text>
                </HStack>
                
                <HStack className="justify-between">
                  <View 
                    style={{
                      flex: 1,
                      backgroundColor: colors.success + '10',
                      borderRadius: 12,
                      padding: 12,
                      marginRight: 6,
                      borderWidth: 1,
                      borderColor: colors.success + '20',
                    }}
                  >
                    <HStack className="items-center mb-1">
                      <Icon as={DollarSign} size="xs" style={{ color: colors.success, marginRight: 4 }} />
                      <Text 
                        style={{ 
                          color: colors.success,
                          fontSize: 10,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        Best Value
                      </Text>
                    </HStack>
                    <Text 
                      style={{ 
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: '500',
                        marginBottom: 2,
                      }}
                      numberOfLines={1}
                    >
                      {bestValue.name}
                    </Text>
                    <Text 
                      style={{ 
                        color: colors.success,
                        fontSize: 16,
                        fontWeight: '700',
                      }}
                    >
                      ${bestValue.discount 
                        ? (bestValue.price * (1 - bestValue.discount / 100)).toFixed(2)
                        : bestValue.price.toFixed(2)
                      }
                    </Text>
                  </View>
                  
                  <View 
                    style={{
                      flex: 1,
                      backgroundColor: colors.warning + '10',
                      borderRadius: 12,
                      padding: 12,
                      marginLeft: 6,
                      borderWidth: 1,
                      borderColor: colors.warning + '20',
                    }}
                  >
                    <HStack className="items-center mb-1">
                      <Icon as={Star} size="xs" style={{ color: colors.warning, marginRight: 4 }} />
                      <Text 
                        style={{ 
                          color: colors.warning,
                          fontSize: 10,
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        Top Rated
                      </Text>
                    </HStack>
                    <Text 
                      style={{ 
                        color: colors.text,
                        fontSize: 12,
                        fontWeight: '500',
                        marginBottom: 2,
                      }}
                      numberOfLines={1}
                    >
                      {highestRated.name}
                    </Text>
                    <HStack className="items-center">
                      <Text 
                        style={{ 
                          color: colors.warning,
                          fontSize: 16,
                          fontWeight: '700',
                          marginRight: 2,
                        }}
                      >
                        {highestRated.rating?.toFixed(1)}
                      </Text>
                      <Icon as={Star} size="xs" style={{ color: colors.warning }} />
                    </HStack>
                  </View>
                </HStack>
              </View>
            )}

            {/* Product Cards - Vertical Layout */}
            <VStack space="md">
              {compareList.map((product, index) => (
                <Animated.View
                  key={product.id}
                  entering={SlideInRight.delay(index * 100)}
                  exiting={SlideOutRight}
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 12,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isDark ? 0.1 : 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                    borderWidth: isDark ? 1 : 0,
                    borderColor: colors.border,
                    overflow: 'hidden',
                  }}
                >
                  <HStack>
                    {/* Product Image */}
                    <View style={{ position: 'relative', width: 120, height: 120 }}>
                      {/* Remove button */}
                      <Pressable
                        onPress={() => handleRemoveProduct(product.id, product.name)}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          zIndex: 10,
                          width: 24,
                          height: 24,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon as={X} size="xs" style={{ color: 'white' }} />
                      </Pressable>

                      {/* Best badges */}
                      {bestValue && product.id === bestValue.id && (
                        <View style={{ position: 'absolute', top: 6, left: 6, zIndex: 10 }}>
                          <View 
                            style={{
                              backgroundColor: colors.success,
                              borderRadius: 6,
                              paddingHorizontal: 4,
                              paddingVertical: 2,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Icon as={DollarSign} size="xs" style={{ color: 'white', marginRight: 1 }} />
                            <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                              Best
                            </Text>
                          </View>
                        </View>
                      )}
                      {highestRated && product.id === highestRated.id && product.id !== bestValue?.id && (
                        <View style={{ position: 'absolute', top: 6, left: 6, zIndex: 10 }}>
                          <View 
                            style={{
                              backgroundColor: colors.warning,
                              borderRadius: 6,
                              paddingHorizontal: 4,
                              paddingVertical: 2,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Icon as={Crown} size="xs" style={{ color: 'white', marginRight: 1 }} />
                            <Text style={{ color: 'white', fontSize: 8, fontWeight: '600' }}>
                              Top
                            </Text>
                          </View>
                        </View>
                      )}

                      <View 
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: colors.surfaceSecondary,
                        }}
                      >
                        <Image
                          source={{ uri: product.image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                          style={{ width: '100%', height: '100%' }}
                          alt={product.name}
                          resizeMode="contain"
                        />
                      </View>

                      {/* Product badges */}
                      <View 
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          flexDirection: 'row',
                          gap: 2,
                        }}
                      >
                        {product.isNew && (
                          <View 
                            style={{
                              backgroundColor: colors.info,
                              borderRadius: 4,
                              paddingHorizontal: 3,
                              paddingVertical: 1,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>
                              NEW
                            </Text>
                          </View>
                        )}
                        {product.isTrending && (
                          <View 
                            style={{
                              backgroundColor: '#FF6B35',
                              borderRadius: 4,
                              paddingHorizontal: 3,
                              paddingVertical: 1,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>
                              HOT
                            </Text>
                          </View>
                        )}
                        {product.discount && (
                          <View 
                            style={{
                              backgroundColor: colors.error,
                              borderRadius: 4,
                              paddingHorizontal: 3,
                              paddingVertical: 1,
                            }}
                          >
                            <Text style={{ color: 'white', fontSize: 7, fontWeight: '600' }}>
                              -{product.discount}%
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Product Info */}
                    <VStack style={{ flex: 1, padding: 12 }} space="xs">
                      {/* Product Name */}
                      <Text 
                        style={{ 
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: '600',
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>

                      {/* Brand */}
                      {product.brand && (
                        <Text 
                          style={{ 
                            color: colors.textSecondary,
                            fontSize: 11,
                            fontWeight: '500',
                          }}
                        >
                          by {product.brand}
                        </Text>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <HStack className="items-center" space="xs">
                          <Icon as={Star} size="xs" style={{ color: colors.warning }} />
                          <Text 
                            style={{ 
                              color: colors.text,
                              fontSize: 11,
                              fontWeight: '600',
                            }}
                          >
                            {product.rating.toFixed(1)}
                          </Text>
                          <Text 
                            style={{ 
                              color: colors.textSecondary,
                              fontSize: 10,
                            }}
                          >
                            ({product.reviewCount || 0})
                          </Text>
                        </HStack>
                      )}

                      {/* Price */}
                      <View>
                        {product.discount ? (
                          <VStack space="xs">
                            <HStack className="items-center" space="sm">
                              <Text 
                                style={{ 
                                  color: colors.primary,
                                  fontSize: 16,
                                  fontWeight: '700',
                                }}
                              >
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </Text>
                              <Text 
                                style={{ 
                                  color: colors.textTertiary,
                                  fontSize: 11,
                                  textDecorationLine: 'line-through',
                                }}
                              >
                                ${product.price.toFixed(2)}
                              </Text>
                            </HStack>
                            <Text 
                              style={{ 
                                color: colors.success,
                                fontSize: 10,
                                fontWeight: '600',
                              }}
                            >
                              Save ${(product.price * (product.discount / 100)).toFixed(2)}
                            </Text>
                          </VStack>
                        ) : (
                          <Text 
                            style={{ 
                              color: colors.primary,
                              fontSize: 16,
                              fontWeight: '700',
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </Text>
                        )}
                      </View>

                      {/* Stock Status */}
                      {product.stock !== undefined && (
                        <HStack className="items-center" space="xs">
                          <View 
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 
                                product.stock > 10 ? colors.success : 
                                product.stock > 0 ? colors.warning : colors.error,
                            }}
                          />
                          <Text 
                            style={{
                              color: 
                                product.stock > 10 ? colors.success : 
                                product.stock > 0 ? colors.warning : colors.error,
                              fontSize: 10,
                              fontWeight: '500',
                            }}
                          >
                            {product.stock > 10 ? 'In Stock' : 
                             product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                          </Text>
                        </HStack>
                      )}
                    </VStack>

                    {/* Add to Cart Button */}
                    <View style={{ justifyContent: 'center', paddingRight: 12 }}>
                      <Pressable
                        onPress={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        style={{
                          backgroundColor: product.stock === 0 ? colors.surfaceTertiary : colors.primary,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 80,
                        }}
                      >
                        <Icon 
                          as={ShoppingCart} 
                          size="xs" 
                          style={{ 
                            color: product.stock === 0 ? colors.textTertiary : 'white',
                            marginRight: 4,
                          }} 
                        />
                        <Text 
                          style={{
                            color: product.stock === 0 ? colors.textTertiary : 'white',
                            fontSize: 11,
                            fontWeight: '600',
                          }}
                        >
                          {product.stock === 0 ? 'Out' : 'Add'}
                        </Text>
                      </Pressable>
                    </View>
                  </HStack>
                </Animated.View>
              ))}
            </VStack>
          </Animated.View>
        )}

        {activeTab === 'specs' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 16 }}>
            {allSpecs.length > 0 ? (
              <View 
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                  overflow: 'hidden',
                }}
              >
                <View 
                  style={{
                    backgroundColor: colors.surfaceSecondary,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <HStack className="items-center mb-2">
                    <Icon as={Info} size="md" style={{ color: colors.primary, marginRight: 12 }} />
                    <Text 
                      style={{ 
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '700',
                      }}
                    >
                      Technical Specifications
                    </Text>
                  </HStack>
                  <Text 
                    style={{ 
                      color: colors.textSecondary,
                      fontSize: 14,
                    }}
                  >
                    Compare detailed product specifications
                  </Text>
                </View>
                
                {allSpecs.map((spec, index) => (
                  <View 
                    key={spec} 
                    style={{
                      backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary,
                    }}
                  >
                    <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                      <Text 
                        style={{ 
                          color: colors.text,
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 12,
                        }}
                      >
                        {spec}
                      </Text>
                      <VStack space="sm">
                        {compareList.map((product) => (
                          <HStack key={`${product.id}-${spec}`} className="items-center justify-between">
                            <HStack className="items-center flex-1">
                              <View 
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                  backgroundColor: colors.primary + '15',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 12,
                                }}
                              >
                                <Text 
                                  style={{ 
                                    color: colors.primary,
                                    fontSize: 12,
                                    fontWeight: '700',
                                  }}
                                >
                                  {product.name.charAt(0)}
                                </Text>
                              </View>
                              <Text 
                                style={{ 
                                  color: colors.textSecondary,
                                  fontSize: 14,
                                  flex: 1,
                                }}
                                numberOfLines={1}
                              >
                                {product.name}
                              </Text>
                            </HStack>
                            <Text 
                              style={{ 
                                color: colors.text,
                                fontSize: 14,
                                fontWeight: '600',
                                marginLeft: 8,
                              }}
                            >
                              {product.specifications?.[spec] || 'Not specified'}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </View>
                    {index < allSpecs.length - 1 && (
                      <View 
                        style={{ 
                          height: 1,
                          backgroundColor: colors.border,
                          marginHorizontal: 20,
                        }} 
                      />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View 
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                  padding: 32,
                  alignItems: 'center',
                }}
              >
                <View 
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: colors.surfaceSecondary,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon as={Info} size="lg" style={{ color: colors.textTertiary }} />
                </View>
                <Text 
                  style={{ 
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                >
                  No Specifications Available
                </Text>
                <Text 
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  The selected products don't have detailed specifications to compare.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {activeTab === 'features' && (
          <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 16 }}>
            {allFeatures.length > 0 ? (
              <View 
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                  overflow: 'hidden',
                }}
              >
                <View 
                  style={{
                    backgroundColor: colors.surfaceSecondary,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <HStack className="items-center mb-2">
                    <Icon as={Check} size="md" style={{ color: colors.primary, marginRight: 12 }} />
                    <Text 
                      style={{ 
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: '700',
                      }}
                    >
                      Features Comparison
                    </Text>
                  </HStack>
                  <Text 
                    style={{ 
                      color: colors.textSecondary,
                      fontSize: 14,
                    }}
                  >
                    See which features are available in each product
                  </Text>
                </View>
                
                {allFeatures.map((feature, index) => (
                  <View 
                    key={feature} 
                    style={{
                      backgroundColor: index % 2 === 0 ? colors.card : colors.surfaceSecondary,
                    }}
                  >
                    <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                      <Text 
                        style={{ 
                          color: colors.text,
                          fontSize: 16,
                          fontWeight: '600',
                          marginBottom: 12,
                        }}
                      >
                        {feature}
                      </Text>
                      <HStack className="justify-between">
                        {compareList.map((product) => (
                          <View key={`${product.id}-${feature}`} style={{ flex: 1, alignItems: 'center' }}>
                            <View 
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: colors.primary + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 8,
                              }}
                            >
                              <Text 
                                style={{ 
                                  color: colors.primary,
                                  fontSize: 12,
                                  fontWeight: '700',
                                }}
                              >
                                {product.name.charAt(0)}
                              </Text>
                            </View>
                            <View 
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: product.features?.includes(feature) 
                                  ? colors.success + '15' 
                                  : colors.error + '15',
                                borderWidth: 1,
                                borderColor: product.features?.includes(feature) 
                                  ? colors.success + '30' 
                                  : colors.error + '30',
                              }}
                            >
                              <Icon 
                                as={product.features?.includes(feature) ? Check : X} 
                                size="sm" 
                                style={{ 
                                  color: product.features?.includes(feature) ? colors.success : colors.error,
                                }} 
                              />
                            </View>
                            <Text 
                              style={{ 
                                color: colors.textSecondary,
                                fontSize: 12,
                                marginTop: 4,
                                textAlign: 'center',
                              }}
                              numberOfLines={1}
                            >
                              {product.name.split(' ')[0]}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </View>
                    {index < allFeatures.length - 1 && (
                      <View 
                        style={{ 
                          height: 1,
                          backgroundColor: colors.border,
                          marginHorizontal: 20,
                        }} 
                      />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View 
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.2 : 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                  padding: 32,
                  alignItems: 'center',
                }}
              >
                <View 
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: colors.surfaceSecondary,
                    borderRadius: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon as={Check} size="lg" style={{ color: colors.textTertiary }} />
                </View>
                <Text 
                  style={{ 
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 8,
                  }}
                >
                  No Features Available
                </Text>
                <Text 
                  style={{ 
                    color: colors.textSecondary,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  The selected products don't have feature lists to compare.
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}