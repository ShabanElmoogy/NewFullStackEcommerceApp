import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import React, { useState } from "react";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import { useCart } from "@/store/cartStore";
import { useToast } from "./ui/toast";
import { CustomToast } from "./CustomToast";
import { useLanguageStore } from "@/store/languageStore";
import { 
  ShoppingCart, 
  Star, 
  Eye, 
  TrendingUp,
  Zap
} from "lucide-react-native";

interface ProductItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    discount?: number;
    isNew?: boolean;
    isTrending?: boolean;
    stock?: number;
  };
 viewMode?: 'grid' | 'list';
}

export default function ProductItem({ product, viewMode = 'grid' }: ProductItemProps) {
  const { name, price, image, description, rating = 4.5, reviewCount = 0, discount, isNew, isTrending, stock = 10 } = product;
  const addToCart = useCart((state) => state.addProduct);
  const toast = useToast();
  const { isRTL } = useLanguageStore();

  const discountedPrice = discount ? price * (1 - discount / 100) : price;
  const isLowStock = stock < 5;
  const isOutOfStock = stock === 0;

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;
    
    addToCart(product);
    toast.show({
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => (
        <CustomToast id={id} message={`${name} added to cart!`} />
      ),
    });
  };

  // Render list view (horizontal layout)
  if (viewMode === 'list') {
    return (
      <Card className="relative overflow-hidden bg-background-0 border border-outline-100 shadow-sm">
        <Link href={`/product/${product.id}`} asChild>
          <Pressable className="active:opacity-95">
            <HStack className="p-4" space="md">
              {/* Product Image Container */}
              <View className="relative bg-background-50 rounded-lg overflow-hidden w-20 h-20 flex-shrink-0">
                <Image
                  source={{ uri: image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                  className="w-full h-full"
                  alt={`${name} image`}
                  resizeMode="cover"
                />

                {/* Stock Status Overlay */}
                {isOutOfStock && (
                  <View className="absolute inset-0 bg-background-900/60 items-center justify-center">
                    <Text className="text-white font-semibold text-xs">Out</Text>
                  </View>
                )}
              </View>

              {/* Product Info */}
              <VStack className="flex-1" space="xs">
                {/* Product Name and Badges */}
                <HStack className="items-start justify-between">
                  <VStack className="flex-1" space="xs">
                    <Text 
                      className="text-base font-semibold text-typography-900 leading-tight" 
                      numberOfLines={2}
                    >
                      {name}
                    </Text>
                    
                    {/* Badges */}
                    <HStack className="flex-wrap" space="xs">
                      {isNew && (
                        <Badge className="bg-success-500">
                          <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
                        </Badge>
                      )}
                      {isTrending && (
                        <Badge className="bg-warning-500">
                          <BadgeText className="text-white text-xs font-semibold">HOT</BadgeText>
                        </Badge>
                      )}
                      {discount && (
                        <Badge className="bg-error-500">
                          <BadgeText className="text-white text-xs font-semibold">-{discount}%</BadgeText>
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                  
                  {/* Wishlist Button */}
                  <WishlistButton 
                    product={product} 
                    size="sm" 
                    variant="filled"
                  />
                </HStack>

                {/* Rating */}
                {rating > 0 && (
                  <HStack className="items-center" space="xs">
                    <HStack space="xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          as={Star}
                          size="xs"
                          className={
                            star <= Math.floor(rating)
                              ? 'text-yellow-500 fill-current'
                              : star <= rating
                              ? 'text-yellow-500'
                              : 'text-typography-300'
                          }
                        />
                      ))}
                    </HStack>
                    <Text className="text-xs text-typography-500">
                      ({reviewCount})
                    </Text>
                  </HStack>
                )}

                {/* Description */}
                {description && (
                  <Text 
                    className="text-sm text-typography-600 leading-relaxed" 
                    numberOfLines={2}
                  >
                    {description}
                  </Text>
                )}

                {/* Price and Actions */}
                <HStack className="items-center justify-between mt-auto">
                  <VStack space="xs">
                    {discount ? (
                      <HStack className="items-center" space="xs">
                        <Heading size="md" className="text-primary-600 font-bold">
                          ${discountedPrice.toFixed(2)}
                        </Heading>
                        <Text className="text-sm text-typography-400 line-through">
                          ${price.toFixed(2)}
                        </Text>
                      </HStack>
                    ) : (
                      <Heading size="md" className="text-primary-600 font-bold">
                        ${price.toFixed(2)}
                      </Heading>
                    )}
                    
                    {/* Low Stock Warning */}
                    {isLowStock && !isOutOfStock && (
                      <HStack className="items-center" space="xs">
                        <Icon as={Zap} size="xs" className="text-warning-500" />
                        <Text className="text-xs text-warning-600 font-medium">
                          Only {stock} left
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  {/* Add to Cart Button */}
                  <Button
                    size="sm"
                    onPress={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`${
                      isOutOfStock 
                        ? 'bg-background-300' 
                        : 'bg-primary-600 active:bg-primary-700'
                    } px-4 py-2`}
                  >
                    <Icon 
                      as={ShoppingCart} 
                      size="xs" 
                      className={`${isRTL ? 'ml-2' : 'mr-2'} ${isOutOfStock ? 'text-typography-400' : 'text-white'}`} 
                    />
                    <ButtonText 
                      className={`text-xs font-semibold ${
                        isOutOfStock ? 'text-typography-400' : 'text-white'
                      }`}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Pressable>
        </Link>
      </Card>
    );
  }

  // Render grid view (vertical layout) - default
  return (
    <View className="flex-1">
      <Card className="flex-1 relative overflow-hidden bg-background-0 border border-outline-100 shadow-sm">
        {/* Product Badges */}
        <View 
          className="absolute top-2 z-20 flex-row gap-1"
          style={{
            left: isRTL ? undefined : 8,
            right: isRTL ? 8 : undefined
          }}
        >
          {isNew && (
            <Badge className="bg-success-500">
              <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-warning-500">
              <Icon as={TrendingUp} size="xs" className={`text-white ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <BadgeText className="text-white text-xs font-semibold">HOT</BadgeText>
            </Badge>
          )}
          {discount && (
            <Badge className="bg-error-500">
              <BadgeText className="text-white text-xs font-semibold">-{discount}%</BadgeText>
            </Badge>
          )}
        </View>

        {/* Wishlist Button */}
        <View 
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 8,
            left: isRTL ? 8 : undefined
          }}
        >
          <WishlistButton 
            product={product} 
            size="sm" 
            variant="filled"
          />
        </View>

        {/* Compare Button */}
        <View 
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 48,
            left: isRTL ? 48 : undefined
          }}
        >
          <CompareButton 
            product={product} 
            size="sm" 
            variant="icon"
          />
        </View>

        {/* Quick View Button */}
        <View 
          className="absolute top-2 z-20"
          style={{
            right: isRTL ? undefined : 88,
            left: isRTL ? 88 : undefined
          }}
        >
          <Link href={`/product/${product.id}`} asChild>
            <Pressable className="w-8 h-8 bg-background-0/90 rounded-full items-center justify-center border border-outline-200 active:scale-95">
              <Icon as={Eye} size="xs" className="text-typography-700" />
            </Pressable>
          </Link>
        </View>

        <Link href={`/product/${product.id}`} asChild>
          <Pressable className="flex-1 active:opacity-95">
            {/* Product Image Container */}
            <View className="relative bg-background-50 rounded-t-lg overflow-hidden h-48">
              <Image
                source={{ uri: image || 'https://via.placeholder.com/300x300?text=No+Image' }}
                className="h-48 w-full absolute inset-0"
                alt={`${name} image`}
                resizeMode="contain"
                style={{ backgroundColor: 'transparent' }}
              />

              {/* Stock Status Overlay */}
              {isOutOfStock && (
                <View className="absolute inset-0 bg-background-900/60 items-center justify-center">
                  <Text className="text-white font-semibold text-sm">Out of Stock</Text>
                </View>
              )}

              {/* Low Stock Warning */}
              {isLowStock && !isOutOfStock && (
                <View 
                  className="absolute bottom-2"
                  style={{
                    left: isRTL ? undefined : 8,
                    right: isRTL ? 8 : undefined
                  }}
                >
                  <Badge className="bg-warning-500">
                    <Icon as={Zap} size="xs" className={`text-white ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    <BadgeText className="text-white text-xs">Only {stock} left</BadgeText>
                  </Badge>
                </View>
              )}
            </View>

            {/* Product Info */}
            <VStack className="p-3 flex-1" space="xs">
              {/* Product Name */}
              <Text 
                className="text-sm font-semibold text-typography-900 leading-tight" 
                numberOfLines={2}
              >
                {name}
              </Text>

              {/* Rating */}
              {rating > 0 && (
                <HStack className="items-center" space="xs">
                  <HStack space="xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        as={Star}
                        size="xs"
                        className={
                          star <= Math.floor(rating)
                            ? 'text-yellow-500 fill-current'
                            : star <= rating
                            ? 'text-yellow-500'
                            : 'text-typography-300'
                        }
                      />
                    ))}
                  </HStack>
                  <Text className="text-xs text-typography-500">
                    ({reviewCount})
                  </Text>
                </HStack>
              )}

              {/* Description */}
              {description && (
                <Text 
                  className="text-xs text-typography-600 leading-relaxed" 
                  numberOfLines={2}
                >
                  {description}
                </Text>
              )}

              {/* Price Section */}
              <VStack className="mt-auto" space="xs">
                <HStack className="items-center justify-between">
                  <VStack>
                    {discount ? (
                      <HStack className="items-center" space="xs">
                        <Heading size="sm" className="text-primary-600 font-bold">
                          ${discountedPrice.toFixed(2)}
                        </Heading>
                        <Text className="text-xs text-typography-400 line-through">
                          ${price.toFixed(2)}
                        </Text>
                      </HStack>
                    ) : (
                      <Heading size="sm" className="text-primary-600 font-bold">
                        ${price.toFixed(2)}
                      </Heading>
                    )}
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Pressable>
        </Link>

        {/* Add to Cart Button */}
        <View className="p-3 pt-0">
          <Button
            size="sm"
            onPress={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full ${
              isOutOfStock 
                ? 'bg-background-300' 
                : 'bg-primary-600 active:bg-primary-700'
            }`}
          >
            <Icon 
              as={ShoppingCart} 
              size="xs" 
              className={`${isRTL ? 'ml-2' : 'mr-2'} ${isOutOfStock ? 'text-typography-400' : 'text-white'}`} 
            />
            <ButtonText 
              className={`text-xs font-semibold ${
                isOutOfStock ? 'text-typography-400' : 'text-white'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </ButtonText>
          </Button>
        </View>
      </Card>
    </View>
  );
}