import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Trash2, ShoppingCart, Heart, ArrowLeft, Plus } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Badge, BadgeText } from '@/components/ui/badge';
import { CustomToast } from '@/components/CustomToast';
import { ConfirmationToast } from '@/components/ConfirmationToast';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/store/authStore';

export default function WishlistScreen() {
  const items = useWishlist((state) => state.items);
  const removeProduct = useWishlist((state) => state.removeProduct);
  const clearWishlist = useWishlist((state) => state.clearWishlist);
  const addToCart = useCart((state) => state.addProduct);
  const toast = useToast();
  const router = useRouter();

  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const setReturnUrl = useAuth(s => s.setReturnUrl);

  const totalItems = items.length;

  useEffect(() => {
    if (!isAuthenticated) {
      setReturnUrl('/wishlist');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, setReturnUrl, router]);

  const handleRemoveItem = (productId: number, productName: string) => {
     removeProduct(productId);
  };
  
  const handleAddToCart = (product: any) => {
    console.log('Adding to cart from wishlist:', product.name);
    addToCart(product);
    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <CustomToast id={id} message={`"${product.name}" added to cart! 🛒`} />
      ),
    });
  };

  const handleClearWishlist = () => {
    console.log('Clear wishlist clicked');
    toast.show({
      placement: "top",
      duration: 8000,
      render: ({ id }) => (
        <ConfirmationToast
          id={id}
          title="Clear Wishlist"
          message={`Remove all ${totalItems} items from your wishlist?`}
          onConfirm={() => {
            console.log('Clearing wishlist');
            clearWishlist();
            toast.close(id);
            toast.show({
              placement: "bottom",
              duration: 3000,
              render: ({ id: successId }) => (
                <CustomToast id={successId} message="Wishlist cleared" />
              ),
            });
          }}
          onCancel={() => {
            console.log('Clear cancelled');
            toast.close(id);
          }}
          confirmText="Clear All"
          cancelText="Cancel"
          type="warning"
        />
      ),
    });
  };

  // Empty wishlist state
  if (items.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background-0">
        <VStack className="items-center" space="lg">
          <View className="w-24 h-24 bg-background-100 rounded-full items-center justify-center">
            <Icon as={Heart} size="xl" className="text-typography-400" />
          </View>
          <VStack className="items-center" space="sm">
            <Heading size="xl" className="text-typography-900">Your wishlist is empty</Heading>
            <Text className="text-typography-600 text-center max-w-[280px]">
              Save items you love to your wishlist and shop them later
            </Text>
          </VStack>
          <Link href="/" asChild>
            <Button size="lg" className="mt-4">
              <ButtonText>Start Shopping</ButtonText>
            </Button>
          </Link>
        </VStack>
      </View>
    );
  }

  const renderWishlistItem = ({ item, index }) => {
    // Handle both Date objects and ISO strings for backward compatibility
    let formattedDate = 'Recently added';
    try {
      if (typeof item.addedAt === 'string') {
        formattedDate = new Date(item.addedAt).toLocaleDateString();
      } else if (item.addedAt && typeof item.addedAt.toLocaleDateString === 'function') {
        formattedDate = item.addedAt.toLocaleDateString();
      }
    } catch (error) {
      console.warn('Error formatting date:', error);
      formattedDate = 'Recently added';
    }
    
    return (
      <Card className="p-4 mb-3 bg-background-0 border border-outline-200">
        <VStack space="md">
          <HStack space="md" className="items-start">
            {/* Product Image */}
            <View className="relative">
              <Image
                source={{ uri: item.product.image || 'https://via.placeholder.com/80x80?text=No+Image' }}
                className="w-20 h-20 rounded-lg"
                alt={item.product.name}
                resizeMode="cover"
              />
              <Badge 
                size="sm" 
                variant="solid" 
                className="absolute -top-2 -right-2 bg-error-500"
              >
                <Icon as={Heart} size="xs" className="text-white" />
              </Badge>
            </View>

            {/* Product Details */}
            <VStack className="flex-1" space="xs">
              <Heading size="sm" className="text-typography-900 leading-tight">
                {item.product.name}
              </Heading>
              <Text className="text-primary-600 font-semibold text-lg">
                ${item.product.price.toFixed(2)}
              </Text>
              <Text className="text-typography-500 text-xs">
                Added {formattedDate}
              </Text>
              {item.product.description && (
                <Text className="text-typography-600 text-sm" numberOfLines={2}>
                  {item.product.description}
                </Text>
              )}
            </VStack>

            {/* Remove Button */}
            <Pressable
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
              className="p-2 rounded-full active:bg-background-100"
            >
              <Icon as={Trash2} size="sm" className="text-error-500" />
            </Pressable>
          </HStack>

          {/* Action Buttons */}
          <HStack space="sm" className="justify-end">
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleAddToCart(item.product)}
              className="flex-1"
            >
              <Icon as={Plus} size="xs" className="text-primary-600 mr-1" />
              <ButtonText className="text-primary-600">Add to Cart</ButtonText>
            </Button>
            
            <Link href={`/product/${item.product.id}`} asChild>
              <Button
                variant="solid"
                size="sm"
                className="flex-1 bg-primary-600"
              >
                <ButtonText className="text-white">View Details</ButtonText>
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-background-50">
      <FlatList
        data={items}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <VStack space="md" className="mb-4">
            <HStack className="justify-between items-center">
              <Heading size="lg" className="text-typography-900">
                My Wishlist
              </Heading>
              <Badge variant="outline" size="md">
                <BadgeText>{totalItems} {totalItems === 1 ? 'item' : 'items'}</BadgeText>
              </Badge>
            </HStack>
            <Divider />
          </VStack>
        }
        ListFooterComponent={
          <VStack space="lg" className="mt-4">
            {/* Wishlist Summary */}
            <Card className="p-4 bg-background-0 border border-outline-200">
              <VStack space="md">
                <Heading size="md" className="text-typography-900 mb-2">
                  Wishlist Summary
                </Heading>
                
                <VStack space="sm">
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Total Items</Text>
                    <Text className="font-semibold">{totalItems}</Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Total Value</Text>
                    <Text className="font-semibold text-primary-600">
                      ${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>

            {/* Action Buttons */}
            <VStack space="sm">
              <Button
                size="lg"
                onPress={() => {
                  // Add all items to cart
                  items.forEach(item => addToCart(item.product));
                  toast.show({
                    placement: "bottom",
                    duration: 4000,
                    render: ({ id }) => (
                      <CustomToast id={id} message={`Added ${totalItems} items to cart! 🛒`} />
                    ),
                  });
                }}
                className="bg-primary-600"
              >
                <Icon as={ShoppingCart} size="sm" className="text-white mr-2" />
                <ButtonText className="text-white font-semibold">
                  Add All to Cart
                </ButtonText>
              </Button>

              {totalItems > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleClearWishlist}
                  className="border-error-300"
                >
                  <Icon as={Trash2} size="sm" className="text-error-500 mr-2" />
                  <ButtonText className="text-error-500">Clear Wishlist</ButtonText>
                </Button>
              )}
              
              <Link href="/" asChild>
                <Button variant="outline" size="lg">
                  <Icon as={ArrowLeft} size="sm" className="text-primary-600 mr-2" />
                  <ButtonText className="text-primary-600">Continue Shopping</ButtonText>
                </Button>
              </Link>
            </VStack>
          </VStack>
        }
      />
    </View>
  );
}