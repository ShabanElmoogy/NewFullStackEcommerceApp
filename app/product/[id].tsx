import { Text } from '@/components/ui/text';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import React, { useState } from "react";
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view';
import { Pressable } from 'react-native';
import { useProduct } from '@/hooks/useProducts';
import { ActivityIndicator } from 'react-native';
import { useCart } from '@/store/cartStore';
import { useToast } from '@/components/ui/toast';
import { CustomToast } from "@/components/CustomToast";
import WishlistButton from '@/components/WishlistButton';
import { 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw,
  Info,
  ChevronRight
} from 'lucide-react-native';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, error } = useProduct(Number(id));
  const addProduct = useCart((state) => state.addProduct);
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-4 text-typography-600">Loading product...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center p-6">
        <Icon as={Info} size="xl" className="text-error-500 mb-4" />
        <Heading size="lg" className="text-error-500 mb-2">Oops!</Heading>
        <Text className="text-center text-typography-600">
          Error loading product: {error.message}
        </Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box className="flex-1 items-center justify-center p-6">
        <Icon as={Info} size="xl" className="text-typography-400 mb-4" />
        <Heading size="lg" className="text-typography-600 mb-2">Not Found</Heading>
        <Text className="text-center text-typography-600">
          Product not found
        </Text>
      </Box>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addProduct(data);
    }

    toast.show({
      placement: "bottom",
      duration: 2000,
      render: ({ id }) => (
        <CustomToast 
          id={id} 
          message={`${quantity} item${quantity > 1 ? 's' : ''} added to cart`} 
        />
      ),
    });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  // Mock data for enhanced features
  const rating = 4.5;
  const reviewCount = 128;
  const inStock = true;
  const images = [data.image, data.image, data.image]; // Mock multiple images

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Stack.Screen options={{ title: data.name }} />
      
      {/* Product Images */}
      <Box className="bg-white">
        <Image
          source={{ uri: images[selectedImageIndex] }}
          className="h-80 w-full"
          alt={`${data.name} image`}
          resizeMode="contain"
        />
        
        {/* Image Thumbnails */}
        {images.length > 1 && (
          <HStack className="px-4 py-3" space="sm">
            {images.map((image, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                className={`border-2 rounded-lg ${
                  selectedImageIndex === index 
                    ? 'border-primary-500' 
                    : 'border-background-200'
                }`}
              >
                <Image
                  source={{ uri: image }}
                  className="h-16 w-16 rounded-md"
                  alt={`${data.name} thumbnail ${index + 1}`}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </HStack>
        )}
      </Box>

      {/* Product Info */}
      <VStack className="p-4" space="md">
        {/* Title and Wishlist */}
        <HStack className="items-start justify-between">
          <VStack className="flex-1 mr-3">
            <Heading size="xl" className="text-typography-900 mb-1">
              {data.name}
            </Heading>
            
            {/* Rating */}
            <HStack className="items-center mb-2" space="xs">
              <HStack space="xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    as={Star}
                    size="sm"
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
              <Text className="text-sm text-typography-600">
                {rating} ({reviewCount} reviews)
              </Text>
            </HStack>
          </VStack>
          
          <WishlistButton product={data} size="lg" variant="outline" />
        </HStack>

        {/* Price and Stock */}
        <HStack className="items-center justify-between">
          <VStack>
            <Heading size="2xl" className="text-primary-600">
              ${data.price}
            </Heading>
            <HStack className="items-center" space="xs">
              <Badge 
                variant={inStock ? "solid" : "outline"} 
                className={inStock ? "bg-success-500" : "border-error-500"}
              >
                <BadgeText className={inStock ? "text-white" : "text-error-500"}>
                  {inStock ? "In Stock" : "Out of Stock"}
                </BadgeText>
              </Badge>
            </HStack>
          </VStack>
        </HStack>

        <Divider />

        {/* Description */}
        <VStack space="sm">
          <Heading size="md" className="text-typography-900">
            Description
          </Heading>
          <Text className="text-typography-700 leading-6">
            {data.description}
          </Text>
        </VStack>

        <Divider />

        {/* Features */}
        <VStack space="sm">
          <Heading size="md" className="text-typography-900">
            Features
          </Heading>
          <VStack space="xs">
            <HStack className="items-center" space="sm">
              <Icon as={Truck} size="sm" className="text-primary-500" />
              <Text className="text-typography-700">Free shipping on orders over $50</Text>
            </HStack>
            <HStack className="items-center" space="sm">
              <Icon as={Shield} size="sm" className="text-primary-500" />
              <Text className="text-typography-700">1 year warranty included</Text>
            </HStack>
            <HStack className="items-center" space="sm">
              <Icon as={RotateCcw} size="sm" className="text-primary-500" />
              <Text className="text-typography-700">30-day return policy</Text>
            </HStack>
          </VStack>
        </VStack>

        <Divider />

        {/* Quantity Selector */}
        <VStack space="sm">
          <Heading size="md" className="text-typography-900">
            Quantity
          </Heading>
          <HStack className="items-center" space="md">
            <HStack className="items-center border border-background-300 rounded-lg">
              <Pressable
                onPress={decrementQuantity}
                className="p-3 active:bg-background-100"
              >
                <Icon as={Minus} size="sm" className="text-typography-600" />
              </Pressable>
              <Box className="px-4 py-3 border-l border-r border-background-300">
                <Text className="font-semibold text-typography-900 min-w-[20px] text-center">
                  {quantity}
                </Text>
              </Box>
              <Pressable
                onPress={incrementQuantity}
                className="p-3 active:bg-background-100"
              >
                <Icon as={Plus} size="sm" className="text-typography-600" />
              </Pressable>
            </HStack>
            <Text className="text-typography-600">
              Total: ${(data.price * quantity).toFixed(2)}
            </Text>
          </HStack>
        </VStack>
      </VStack>

      {/* Bottom Action Bar */}
      <Box className="p-4 bg-white border-t border-background-200">
        <HStack space="sm">
          <Button
            variant="outline"
            className="flex-1 border-primary-500"
            onPress={() => {
              // Add to wishlist functionality can be handled by WishlistButton
              toast.show({
                placement: "bottom",
                duration: 2000,
                render: ({ id }) => (
                  <CustomToast id={id} message="Added to wishlist ❤️" />
                ),
              });
            }}
          >
            <ButtonText className="text-primary-500">Add to Wishlist</ButtonText>
          </Button>
          
          <Button
            className="flex-2 bg-primary-600"
            onPress={handleAddToCart}
            isDisabled={!inStock}
          >
            <Icon as={ShoppingCart} size="sm" className="text-white mr-2" />
            <ButtonText className="text-white font-semibold">
              Add to Cart • ${(data.price * quantity).toFixed(2)}
            </ButtonText>
          </Button>
        </HStack>
      </Box>
    </ScrollView>
  );
}