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
import { useCart } from "@/store/cartStore";
import { useToast } from "./ui/toast";
import { CustomToast } from "./CustomToast";
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
}

export default function ProductItem({ product }: ProductItemProps) {
  const { name, price, image, description, rating = 4.5, reviewCount = 0, discount, isNew, isTrending, stock = 10 } = product;
  const addToCart = useCart((state) => state.addProduct);
  const toast = useToast();

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

  return (
    <View className="flex-1">
      <Card className="flex-1 relative overflow-hidden bg-background-0 border border-outline-100 shadow-sm">
        {/* Product Badges */}
        <View className="absolute top-2 left-2 z-20 flex-row gap-1">
          {isNew && (
            <Badge className="bg-success-500">
              <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
            </Badge>
          )}
          {isTrending && (
            <Badge className="bg-warning-500">
              <Icon as={TrendingUp} size="xs" className="text-white mr-1" />
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
        <View className="absolute top-2 right-2 z-20">
          <WishlistButton 
            product={product} 
            size="sm" 
            variant="filled"
          />
        </View>

        {/* Quick View Button */}
        <View className="absolute top-2 right-12 z-20">
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
                <View className="absolute bottom-2 left-2">
                  <Badge className="bg-warning-500">
                    <Icon as={Zap} size="xs" className="text-white mr-1" />
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
              className={`mr-2 ${isOutOfStock ? 'text-typography-400' : 'text-white'}`} 
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