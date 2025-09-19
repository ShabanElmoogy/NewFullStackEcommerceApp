import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import React, { useEffect } from 'react';
import { FlatList, View, Dimensions } from 'react-native';
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
import { useAuth } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WishlistScreen() {
  const items = useWishlist((state) => state.items);
  const removeProduct = useWishlist((state) => state.removeProduct);
  const clearWishlist = useWishlist((state) => state.clearWishlist);
  const addToCart = useCart((state) => state.addProduct);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const setReturnUrl = useAuth(s => s.setReturnUrl);

  const totalItems = items.length;
  const screenWidth = Dimensions.get('window').width;

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
    addToCart(product);
    //TODO: Add Toast
    // toast.show({
    //   placement: "bottom",
    //   duration: 3000,
    //   render: ({ id }) => (
    //     <CustomToast id={id} message={`"${product.name}" added to cart! 🛒`} />
    //   ),
    // });
  };

  const handleClearWishlist = () => {
      //TODO: Add Toast

    // toast.show({
    //   placement: "top",
    //   duration: 8000,
    //   render: ({ id }) => (
    //     <ConfirmationToast
    //       id={id}
    //       title="Clear Wishlist"
    //       message={`Remove all ${totalItems} items from your wishlist?`}
    //       onConfirm={() => {
    //         clearWishlist();
    //         toast.close(id);
    //         toast.show({
    //           placement: "bottom",
    //           duration: 3000,
    //           render: ({ id: successId }) => (
    //             <CustomToast id={successId} message="Wishlist cleared" />
    //           ),
    //         });
    //       }}
    //       onCancel={() => {
    //         toast.close(id);
    //       }}
    //       confirmText="Clear All"
    //       cancelText="Cancel"
    //       type="warning"
    //     />
    //   ),
    // });
  };

  // Empty wishlist state
  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <VStack className="items-center" space="lg">
            <View 
              style={{ 
                width: 96, 
                height: 96, 
                backgroundColor: colors.surfaceSecondary, 
                borderRadius: 48, 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Icon as={Heart} size="xl" style={{ color: colors.textTertiary }} />
            </View>
            <VStack className="items-center" space="sm">
              <Heading size="xl" style={{ color: colors.text }}>Your wishlist is empty</Heading>
              <Text style={{ color: colors.textSecondary, textAlign: 'center', maxWidth: 280 }}>
                Save items you love to your wishlist and shop them later
              </Text>
            </VStack>
            <Link href="/" asChild>
              <Button 
                size="lg" 
                style={{ backgroundColor: colors.primary, marginTop: 16 }}
              >
                <ButtonText style={{ color: colors.textInverse }}>Start Shopping</ButtonText>
              </Button>
            </Link>
          </VStack>
        </View>
      </SafeAreaView>
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
      <View 
        style={{ 
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <VStack space="md">
          <HStack space="md" className="items-start">
            {/* Product Image */}
            <View className="relative">
              <Image
                source={{ uri: item.product.image || 'https://via.placeholder.com/80x80?text=No+Image' }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
                alt={item.product.name}
                resizeMode="cover"
              />
              <View 
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: colors.error,
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.card,
                }}
              >
                <Icon as={Heart} size="xs" style={{ color: colors.textInverse }} />
              </View>
            </View>

            {/* Product Details */}
            <View style={{ flex: 1, marginRight: 8 }}>
              <Heading size="sm" style={{ color: colors.text, marginBottom: 4 }}>
                {item.product.name}
              </Heading>
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 18, marginBottom: 4 }}>
                ${item.product.price.toFixed(2)}
              </Text>
              <Text style={{ color: colors.textTertiary, fontSize: 12, marginBottom: 4 }}>
                Added {formattedDate}
              </Text>
              {item.product.description && (
                <Text 
                  style={{ color: colors.textSecondary, fontSize: 14 }} 
                  numberOfLines={2}
                >
                  {item.product.description}
                </Text>
              )}
            </View>

            {/* Remove Button */}
            <Pressable
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: 'transparent',
              }}
              android_ripple={{ color: colors.surfaceSecondary, borderless: true }}
            >
              <Icon as={Trash2} size="sm" style={{ color: colors.error }} />
            </Pressable>
          </HStack>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => handleAddToCart(item.product)}
              style={{ 
                flex: 1,
                borderColor: colors.primary,
                backgroundColor: 'transparent',
                maxWidth: (screenWidth - 64) / 2 - 4, // Ensure buttons don't overflow
              }}
            >
              <Icon as={Plus} size="xs" style={{ color: colors.primary, marginRight: 4 }} />
              <ButtonText style={{ color: colors.primary, fontSize: 14 }}>Add to Cart</ButtonText>
            </Button>
            
            <Link href={`/product/${item.product.id}`} asChild>
              <Button
                variant="solid"
                size="sm"
                style={{ 
                  flex: 1,
                  backgroundColor: colors.primary,
                  maxWidth: (screenWidth - 64) / 2 - 4, // Ensure buttons don't overflow
                }}
              >
                <ButtonText style={{ color: colors.textInverse, fontSize: 14 }}>View Details</ButtonText>
              </Button>
            </Link>
          </View>
        </VStack>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'bottom']}>
      <FlatList
        data={items}
        renderItem={renderWishlistItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.backgroundSecondary }}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Heading size="lg" style={{ color: colors.text }}>
                My Wishlist
              </Heading>
              <View 
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: colors.surface,
                }}
              >
                <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border }} />
          </View>
        }
        ListFooterComponent={
          <View style={{ gap: 16, marginTop: 16 }}>
            {/* Wishlist Summary */}
            <View 
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Heading size="md" style={{ color: colors.text, marginBottom: 16 }}>
                Wishlist Summary
              </Heading>
              
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textSecondary }}>Total Items</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>{totalItems}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.textSecondary }}>Total Value</Text>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>
                    ${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 12 }}>
              <Button
                size="lg"
                onPress={() => {
                  // Add all items to cart
                  items.forEach(item => addToCart(item.product));
                  //TODO: Add Toast
                }}
                style={{ backgroundColor: colors.primary }}
              >
                <Icon as={ShoppingCart} size="sm" style={{ color: colors.textInverse, marginRight: 8 }} />
                <ButtonText style={{ color: colors.textInverse, fontWeight: '600' }}>
                  Add All to Cart
                </ButtonText>
              </Button>

              {totalItems > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleClearWishlist}
                  style={{ borderColor: colors.error, backgroundColor: 'transparent' }}
                >
                  <Icon as={Trash2} size="sm" style={{ color: colors.error, marginRight: 8 }} />
                  <ButtonText style={{ color: colors.error }}>Clear Wishlist</ButtonText>
                </Button>
              )}
              
              <Link href="/" asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{ borderColor: colors.primary, backgroundColor: 'transparent' }}
                >
                  <Icon as={ArrowLeft} size="sm" style={{ color: colors.primary, marginRight: 8 }} />
                  <ButtonText style={{ color: colors.primary }}>Continue Shopping</ButtonText>
                </Button>
              </Link>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
