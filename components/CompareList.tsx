import React from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Button, ButtonText } from '@/components/ui/button';
import { useCompareStore } from '@/store/compareStore';
import { X, Scale, ArrowRight, Trash2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import Animated, { 
  SlideInRight, 
  SlideOutRight,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

interface CompareListProps {
  showImages?: boolean;
  showPrices?: boolean;
  maxItems?: number;
  onItemPress?: (productId: number) => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CompareList({
  showImages = true,
  showPrices = true,
  maxItems,
  onItemPress
}: CompareListProps) {
  const { compareList, removeFromCompare, clearCompare, getCompareCount } = useCompareStore();
  
  const compareCount = getCompareCount();
  const displayList = maxItems ? compareList.slice(0, maxItems) : compareList;
  const hasMore = maxItems && compareList.length > maxItems;

  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCompare(productId);
    Toast.show({
      type: "success",
      text1: "✅ Removed from Compare",
      text2: `${productName} removed from comparison`,
      visibilityTime: 2000,
    });
  };

  const handleClearAll = () => {
    clearCompare();
    Toast.show({
      type: "success",
      text1: "✅ Compare Cleared",
      text2: "All items removed from comparison",
      visibilityTime: 2000,
    });
  };

  if (compareCount === 0) {
    return (
      <AnimatedView
        entering={FadeIn}
        exiting={FadeOut}
        className="bg-white rounded-xl p-6 items-center border border-gray-100"
      >
        <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
          <Icon as={Scale} size="lg" className="text-blue-500" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          No Items to Compare
        </Text>
        <Text className="text-gray-500 text-center text-sm">
          Add products to your comparison list to see them here
        </Text>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView
      entering={FadeIn}
      exiting={FadeOut}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <Icon as={Scale} size="md" className="text-blue-600 mr-2" />
            <VStack>
              <Text className="font-bold text-gray-900">Compare List</Text>
              <Text className="text-xs text-gray-500">
                {compareCount} item{compareCount > 1 ? 's' : ''} selected
              </Text>
            </VStack>
          </HStack>
          
          <HStack className="items-center" space="sm">
            <Pressable
              onPress={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 active:bg-red-100"
            >
              <HStack className="items-center" space="xs">
                <Icon as={Trash2} size="xs" className="text-red-600" />
                <Text className="text-red-600 font-medium text-xs">Clear</Text>
              </HStack>
            </Pressable>
            
            {compareCount >= 2 && (
              <Link href="/compare" asChild>
                <Button className="bg-blue-500 px-3 py-1.5 rounded-lg">
                  <HStack className="items-center" space="xs">
                    <ButtonText className="text-white font-medium text-xs">
                      Compare
                    </ButtonText>
                    <Icon as={ArrowRight} size="xs" className="text-white" />
                  </HStack>
                </Button>
              </Link>
            )}
          </HStack>
        </HStack>
      </View>

      {/* Items List */}
      <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
        {displayList.map((product, index) => (
          <AnimatedView
            key={product.id}
            entering={SlideInRight.delay(index * 50)}
            exiting={SlideOutRight}
            className={`${index > 0 ? 'border-t border-gray-100' : ''}`}
          >
            <Pressable
              onPress={() => onItemPress?.(product.id)}
              className="p-4 active:bg-gray-50"
            >
              <HStack className="items-center" space="md">
                {/* Product Image */}
                {showImages && (
                  <View className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      source={{ 
                        uri: product.image || 'https://via.placeholder.com/100x100?text=No+Image' 
                      }}
                      className="w-full h-full"
                      alt={product.name}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Product Info */}
                <VStack className="flex-1" space="xs">
                  <Text className="font-semibold text-gray-900 text-sm" numberOfLines={1}>
                    {product.name}
                  </Text>
                  {product.brand && (
                    <Text className="text-xs text-gray-500">
                      by {product.brand}
                    </Text>
                  )}
                  {showPrices && (
                    <HStack className="items-center" space="xs">
                      {product.discount ? (
                        <>
                          <Text className="font-bold text-blue-600 text-sm">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </Text>
                          <Text className="text-xs text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </Text>
                        </>
                      ) : (
                        <Text className="font-bold text-blue-600 text-sm">
                          ${product.price.toFixed(2)}
                        </Text>
                      )}
                    </HStack>
                  )}
                </VStack>

                {/* Remove Button */}
                <AnimatedPressable
                  onPress={() => handleRemoveItem(product.id, product.name)}
                  className="w-8 h-8 items-center justify-center rounded-full bg-gray-100 active:bg-red-100"
                >
                  <Icon as={X} size="sm" className="text-gray-600 active:text-red-600" />
                </AnimatedPressable>
              </HStack>
            </Pressable>
          </AnimatedView>
        ))}

        {/* Show more indicator */}
        {hasMore && (
          <View className="p-4 border-t border-gray-100 bg-gray-50">
            <Link href="/compare" asChild>
              <Pressable className="items-center">
                <Text className="text-blue-600 font-medium text-sm">
                  +{compareList.length - maxItems!} more items • View all
                </Text>
              </Pressable>
            </Link>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {compareCount < 2 && (
        <View className="px-4 py-3 bg-yellow-50 border-t border-yellow-200">
          <HStack className="items-center">
            <Icon as={Scale} size="sm" className="text-yellow-600 mr-2" />
            <Text className="text-yellow-700 text-xs flex-1">
              Add at least 2 products to start comparing
            </Text>
          </HStack>
        </View>
      )}
    </AnimatedView>
  );
}