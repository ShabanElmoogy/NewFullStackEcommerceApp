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
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useCompareStore, Product } from '@/store/compareStore';
import { useCart } from '@/store/cartStore';
import { CustomToast } from '@/components/CustomToast';
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
  Crown
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { 
  SlideInRight, 
  SlideOutRight 
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function CompareScreen() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const addToCart = useCart((state) => state.addProduct);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'features'>('overview');

  const handleBack = () => {
    try {
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.push('/products');
        }
      }, 0);
    } catch (error) {
      console.warn('Navigation error:', error);
      setTimeout(() => {
        try {
          router.replace('/products');
        } catch (fallbackError) {
          console.warn('Fallback navigation error:', fallbackError);
        }
      }, 100);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    removeFromCompare(productId);
    if (compareList.length <= 1) {
      handleBack();
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // toast.show({
    //   placement: "bottom",
    //   duration: 2000,
    //   render: ({ id }) => (
    //     <CustomToast 
    //       id={id} 
    //       message={`${product.name} added to cart!`}
    //     />
    //   ),
    // });
    //TODO: Add Toast
  };

  const handleClearAll = () => {
    clearCompare();
    handleBack();
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

  if (compareList.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center max-w-sm w-full">
          <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-4">
            <Icon as={Info} size="xl" className="text-blue-500" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
            No Products to Compare
          </Text>
          <Text className="text-gray-500 mb-6 text-center leading-relaxed">
            Add products to comparison from the products page to see detailed side-by-side comparisons
          </Text>
          <Button onPress={handleBack} className="bg-blue-500 w-full">
            <ButtonText className="text-white font-semibold">Browse Products</ButtonText>
          </Button>
        </View>
      </View>
    );
  }

  const bestValue = getBestValue();
  const highestRated = getHighestRated();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Enhanced Header */}
      <View className="bg-white shadow-sm border-b border-gray-100">
        <View className="px-4 py-4">
          <HStack className="items-center justify-between mb-4">
            <HStack className="items-center" space="md">
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
              >
                <Icon as={ArrowLeft} size="md" className="text-gray-700" />
              </Pressable>
              
              <VStack>
                <Text className="text-xl font-bold text-gray-900">
                  Product Comparison
                </Text>
                <Text className="text-sm text-gray-500">
                  Compare {compareList.length} products side by side
                </Text>
              </VStack>
            </HStack>

            <Pressable
              onPress={handleClearAll}
              className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 active:bg-red-100"
            >
              <Text className="text-red-600 font-semibold text-sm">Clear All</Text>
            </Pressable>
          </HStack>

          {/* Tab Navigation */}
          <HStack className="bg-gray-100 rounded-lg p-1" space="xs">
            {[
              { key: 'overview', label: 'Overview', icon: Award },
              { key: 'specs', label: 'Specifications', icon: Info },
              { key: 'features', label: 'Features', icon: Check }
            ].map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-md ${
                  activeTab === tab.key ? 'bg-white shadow-sm' : ''
                }`}
              >
                <Icon 
                  as={tab.icon} 
                  size="sm" 
                  className={`mr-2 ${activeTab === tab.key ? 'text-blue-600' : 'text-gray-500'}`} 
                />
                <Text className={`font-medium text-sm ${
                  activeTab === tab.key ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View className="p-4">
            {/* Quick Insights */}
            {bestValue && highestRated && (
              <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                <Text className="text-lg font-bold text-gray-900 mb-3">Quick Insights</Text>
                <HStack className="justify-between">
                  <View className="flex-1 bg-green-50 rounded-lg p-3 mr-2">
                    <HStack className="items-center mb-1">
                      <Icon as={DollarSign} size="sm" className="text-green-600 mr-1" />
                      <Text className="text-xs font-semibold text-green-600 uppercase tracking-wide">Best Value</Text>
                    </HStack>
                    <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                      {bestValue.name}
                    </Text>
                    <Text className="text-green-600 font-bold text-lg">
                      ${bestValue.discount 
                        ? (bestValue.price * (1 - bestValue.discount / 100)).toFixed(2)
                        : bestValue.price.toFixed(2)
                      }
                    </Text>
                  </View>
                  
                  <View className="flex-1 bg-yellow-50 rounded-lg p-3 ml-2">
                    <HStack className="items-center mb-1">
                      <Icon as={Star} size="sm" className="text-yellow-600 mr-1" />
                      <Text className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">Top Rated</Text>
                    </HStack>
                    <Text className="font-bold text-gray-900 text-sm" numberOfLines={1}>
                      {highestRated.name}
                    </Text>
                    <HStack className="items-center">
                      <Text className="text-yellow-600 font-bold text-lg mr-1">
                        {highestRated.rating?.toFixed(1)}
                      </Text>
                      <Icon as={Star} size="xs" className="text-yellow-500 fill-current" />
                    </HStack>
                  </View>
                </HStack>
              </View>
            )}

            {/* Product Cards Grid */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <HStack space="md" className="px-1">
                {compareList.map((product, index) => (
                  <Animated.View
                    key={product.id}
                    entering={SlideInRight.delay(index * 100)}
                    exiting={SlideOutRight}
                    className="w-72 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Product Header */}
                    <View className="relative">
                      {/* Remove button */}
                      <Pressable
                        onPress={() => handleRemoveProduct(product.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full items-center justify-center shadow-sm"
                      >
                        <Icon as={X} size="sm" className="text-gray-600" />
                      </Pressable>

                      {/* Best badges */}
                      {bestValue && product.id === bestValue.id && (
                        <View className="absolute top-3 left-3 z-10">
                          <Badge className="bg-green-500">
                            <Icon as={DollarSign} size="xs" className="text-white mr-1" />
                            <BadgeText className="text-white text-xs font-bold">Best Value</BadgeText>
                          </Badge>
                        </View>
                      )}
                      {highestRated && product.id === highestRated.id && product.id !== bestValue?.id && (
                        <View className="absolute top-3 left-3 z-10">
                          <Badge className="bg-yellow-500">
                            <Icon as={Crown} size="xs" className="text-white mr-1" />
                            <BadgeText className="text-white text-xs font-bold">Top Rated</BadgeText>
                          </Badge>
                        </View>
                      )}

                      {/* Product Image */}
                      <View className="h-48 bg-gray-100">
                        <Image
                          source={{ uri: product.image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                          className="w-full h-full"
                          alt={product.name}
                          resizeMode="cover"
                        />
                      </View>

                      {/* Product badges */}
                      <View className="absolute bottom-3 left-3 flex-row gap-1">
                        {product.isNew && (
                          <Badge className="bg-blue-500">
                            <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
                          </Badge>
                        )}
                        {product.isTrending && (
                          <Badge className="bg-orange-500">
                            <BadgeText className="text-white text-xs font-semibold">TRENDING</BadgeText>
                          </Badge>
                        )}
                        {product.discount && (
                          <Badge className="bg-red-500">
                            <BadgeText className="text-white text-xs font-semibold">-{product.discount}%</BadgeText>
                          </Badge>
                        )}
                      </View>
                    </View>

                    {/* Product Info */}
                    <VStack className="p-4" space="sm">
                      <VStack space="xs">
                        <Text className="font-bold text-gray-900 text-lg leading-tight" numberOfLines={2}>
                          {product.name}
                        </Text>
                        {product.brand && (
                          <Text className="text-sm text-gray-500 font-medium">
                            by {product.brand}
                          </Text>
                        )}
                      </VStack>

                      {/* Rating */}
                      {product.rating && (
                        <HStack className="items-center bg-gray-50 rounded-lg px-3 py-2">
                          <HStack className="items-center flex-1">
                            <Icon as={Star} size="sm" className="text-yellow-500 fill-current mr-1" />
                            <Text className="font-bold text-gray-900 mr-2">
                              {product.rating.toFixed(1)}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              ({product.reviewCount || 0} reviews)
                            </Text>
                          </HStack>
                        </HStack>
                      )}

                      {/* Price */}
                      <VStack className="bg-blue-50 rounded-lg p-3" space="xs">
                        {product.discount ? (
                          <VStack space="xs">
                            <HStack className="items-center justify-between">
                              <Text className="text-2xl font-bold text-blue-600">
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </Text>
                              <Badge className="bg-red-500">
                                <BadgeText className="text-white text-xs font-bold">
                                  Save ${(product.price * (product.discount / 100)).toFixed(2)}
                                </BadgeText>
                              </Badge>
                            </HStack>
                            <Text className="text-sm text-gray-500 line-through">
                              Original: ${product.price.toFixed(2)}
                            </Text>
                          </VStack>
                        ) : (
                          <Text className="text-2xl font-bold text-blue-600">
                            ${product.price.toFixed(2)}
                          </Text>
                        )}
                      </VStack>

                      {/* Stock Status */}
                      {product.stock !== undefined && (
                        <HStack className="items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <HStack className="items-center">
                            <View className={`w-3 h-3 rounded-full mr-2 ${
                              product.stock > 10 ? 'bg-green-500' : 
                              product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <Text className={`text-sm font-medium ${
                              product.stock > 10 ? 'text-green-600' : 
                              product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {product.stock > 10 ? 'In Stock' : 
                               product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                            </Text>
                          </HStack>
                          {product.stock > 0 && product.stock <= 5 && (
                            <Icon as={AlertTriangle} size="sm" className="text-yellow-500" />
                          )}
                        </HStack>
                      )}

                      {/* Add to Cart Button */}
                      <Button
                        onPress={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full mt-2 ${
                          product.stock === 0 ? 'bg-gray-300' : 'bg-blue-500 active:bg-blue-600'
                        }`}
                      >
                        <Icon 
                          as={ShoppingCart} 
                          size="sm" 
                          className={`mr-2 ${product.stock === 0 ? 'text-gray-500' : 'text-white'}`} 
                        />
                        <ButtonText className={`font-semibold ${
                          product.stock === 0 ? 'text-gray-500' : 'text-white'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </ButtonText>
                      </Button>
                    </VStack>
                  </Animated.View>
                ))}
              </HStack>
            </ScrollView>
          </View>
        )}

        {activeTab === 'specs' && (
          <View className="p-4">
            {allSpecs.length > 0 ? (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-900">Technical Specifications</Text>
                  <Text className="text-sm text-gray-500">Compare detailed product specifications</Text>
                </View>
                
                {allSpecs.map((spec, index) => (
                  <View key={spec} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <View className="px-4 py-4">
                      <Text className="font-semibold text-gray-900 mb-3 text-base">
                        {spec}
                      </Text>
                      <VStack space="sm">
                        {compareList.map((product) => (
                          <HStack key={`${product.id}-${spec}`} className="items-center justify-between">
                            <HStack className="items-center flex-1">
                              <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                                <Text className="text-xs font-bold text-gray-600">
                                  {product.name.charAt(0)}
                                </Text>
                              </View>
                              <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
                                {product.name}
                              </Text>
                            </HStack>
                            <Text className="text-sm font-medium text-gray-900 ml-2">
                              {product.specifications?.[spec] || 'Not specified'}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </View>
                    {index < allSpecs.length - 1 && <View className="h-px bg-gray-200 mx-4" />}
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 items-center">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Icon as={Info} size="lg" className="text-gray-400" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 mb-2">No Specifications Available</Text>
                <Text className="text-gray-500 text-center">
                  The selected products don't have detailed specifications to compare.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'features' && (
          <View className="p-4">
            {allFeatures.length > 0 ? (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-900">Features Comparison</Text>
                  <Text className="text-sm text-gray-500">See which features are available in each product</Text>
                </View>
                
                {allFeatures.map((feature, index) => (
                  <View key={feature} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <View className="px-4 py-4">
                      <Text className="font-semibold text-gray-900 mb-3 text-base">
                        {feature}
                      </Text>
                      <HStack className="justify-between">
                        {compareList.map((product) => (
                          <View key={`${product.id}-${feature}`} className="flex-1 items-center">
                            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-2">
                              <Text className="text-xs font-bold text-gray-600">
                                {product.name.charAt(0)}
                              </Text>
                            </View>
                            <View className={`w-8 h-8 rounded-full items-center justify-center ${
                              product.features?.includes(feature) ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <Icon 
                                as={product.features?.includes(feature) ? Check : X} 
                                size="sm" 
                                className={product.features?.includes(feature) ? 'text-green-600' : 'text-red-500'} 
                              />
                            </View>
                            <Text className="text-xs text-gray-500 mt-1 text-center" numberOfLines={1}>
                              {product.name.split(' ')[0]}
                            </Text>
                          </View>
                        ))}
                      </HStack>
                    </View>
                    {index < allFeatures.length - 1 && <View className="h-px bg-gray-200 mx-4" />}
                  </View>
                ))}
              </View>
            ) : (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 items-center">
                <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <Icon as={Check} size="lg" className="text-gray-400" />
                </View>
                <Text className="text-lg font-semibold text-gray-900 mb-2">No Features Available</Text>
                <Text className="text-gray-500 text-center">
                  The selected products don't have feature lists to compare.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}