import { useCart } from '@/store/cartStore';
import React, { useEffect } from 'react';
import { FlatList, View, StatusBar } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pressable } from 'react-native';
import { Redirect, useRouter, Link } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Trash } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { ConfirmationToast } from '@/components/ConfirmationToast';
import { useAuth } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import ReusableDialog from '@/components/ui/ReusableDialog';
import { Modal, Animated, Dimensions } from 'react-native';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const removeProduct = useCart((state) => state.removeProduct);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);
  const resetCart = useCart((state) => state.resetCart);
  const router = useRouter();

  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const setReturnUrl = useAuth(s => s.setReturnUrl);
  
  // Theme colors
  const { colors, isDark } = useTheme();

  // Dialog state for clear all confirmation
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  // Screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Debug effect to track state changes
  React.useEffect(() => {
    console.log('showClearDialog state changed to:', showClearDialog);
    
    if (showClearDialog) {
      // Reset animation values and animate in
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showClearDialog, fadeAnim, scaleAnim]);

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items
    .reduce((total, item) => total + item.quantity * item.product.price, 0);
  const subtotal = totalPrice;
  const shipping = totalPrice > 100 ? 0 : 10; // Free shipping over $100
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) {
      setReturnUrl('/cart');
      router.replace('/login');
    }
  }, [isAuthenticated, setReturnUrl, router]);

  const createOrderMutation = useMutation({
    mutationFn: () => {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      console.log('Order items:', orderItems);
      return createOrder(orderItems);
    },
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
      resetCart();
      // toast.show({
      //   placement: "bottom",
      //   duration: 4000,
      //   render: ({ id }) => (
      //     <CustomToast id={id} message="Order placed successfully! 🎉" />
      //   ),
      // });
        //TODO: Add Toast
      router.push('/');
    },

    onError: (error) => {
      // toast.show({
      //   placement: "bottom",
      //   duration: 4000,
      //   render: ({ id }) => (
      //     <CustomToast id={id} message={`Failed to place order: ${error.message}`} />
      //   ),
      // });
      //TODO: Add Toast
    }
  });

  const handleRemoveItem = (productId: number, productName: string) => {
    console.log('Remove item clicked:', productName);
    // toast.show({
    //   placement: "top",
    //   duration: 8000,
    //   render: ({ id }) => (
    //     <SafeToast placement="top">
    //       <ConfirmationToast
    //         id={id}
    //         title="Remove Item"
    //         message={`Are you sure you want to remove "${productName}" from your cart?`}
    //         onConfirm={() => {
    //           console.log('Removing item:', productId);
    //           removeProduct(productId);
    //           toast.close(id);
    //           toast.show({
    //             placement: "bottom",
    //             duration: 3000,
    //             render: ({ id: successId }) => (
    //               <CustomToast id={successId} message="Item removed from cart" />
    //             ),
    //           });
    //         }}
    //         onCancel={() => {
    //           console.log('Remove cancelled');
    //           toast.close(id);
    //         }}
    //         confirmText="Remove"
    //         cancelText="Cancel"
    //         type="danger"
    //       />
    //     </SafeToast>
    //   ),
    // });
    //TODO: Add Toast
  };

  const handleClearAllItems = () => {
    console.log('Clear all items clicked');
    console.log('Total quantity:', totalQuantity);
    console.log('Current showClearDialog state before:', showClearDialog);
    
    // Force state update and ensure it's applied
    setShowClearDialog(prev => {
      console.log('Setting showClearDialog from', prev, 'to true');
      return true;
    });
  };

  const handleConfirmClear = async () => {
    console.log('Clearing all items from cart');
    setIsClearing(true);
    
    // Add a small delay for better UX
    setTimeout(() => {
      resetCart();
      setIsClearing(false);
      setShowClearDialog(false);
    }, 500);
  };

  const handleCancelClear = () => {
    console.log('Clear cancelled');
    setShowClearDialog(false);
  };

  const onCheckOut = () => {
    console.log('=== CHECKOUT BUTTON PRESSED ===');
    console.log('Items to order:', items);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Total amount:', finalTotal.toFixed(2));

    //TODO: Add Toast
    
    // toast.show({
    //   placement: "top",
    //   duration: 10000,
    //   render: ({ id }) => (
    //     <SafeToast placement="top">
    //       <ConfirmationToast
    //         id={id}
    //         title="Confirm Order"
    //         message={`Place order for ${finalTotal.toFixed(2)}?\n\n${totalQuantity} items • Total: ${finalTotal.toFixed(2)}`}
    //         onConfirm={() => {
    //           console.log('Order confirmed, calling mutation...');
    //           toast.close(id);
    //           createOrderMutation.mutate();
    //         }}
    //         onCancel={() => {
    //           console.log('Order cancelled');
    //           toast.close(id);
    //         }}
    //         confirmText="Place Order"
    //         cancelText="Cancel"
    //         type="info"
    //       />
    //     </SafeToast>
    //   ),
    // });
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <VStack className="items-center" space="lg">
            <View style={{
              width: 96,
              height: 96,
              backgroundColor: colors.surfaceSecondary,
              borderRadius: 48,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon as={ShoppingBag} size="xl" style={{ color: colors.textTertiary }} />
            </View>
            <VStack className="items-center" space="sm">
              <Heading size="xl" style={{ color: colors.text }}>Your cart is empty</Heading>
              <Text style={{ 
                color: colors.textSecondary, 
                textAlign: 'center', 
                maxWidth: 280 
              }}>
                Looks like you haven't added any items to your cart yet
              </Text>
            </VStack>
            <Link href="/" asChild>
              <Button 
                size="lg" 
                style={{ 
                  backgroundColor: colors.primary,
                  marginTop: 16
                }}
              >
                <ButtonText style={{ color: colors.textInverse }}>Start Shopping</ButtonText>
              </Button>
            </Link>
          </VStack>
        </View>
      </View>
    );
  }

  const renderCartItem = ({ item, index }) => {
    const itemTotal = item.quantity * item.product.price;
    
    return (
      <View style={{
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
      }}>
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
              <View style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                minWidth: 24,
                alignItems: 'center'
              }}>
                <Text style={{ 
                  color: colors.textInverse, 
                  fontSize: 12, 
                  fontWeight: 'bold' 
                }}>
                  {item.quantity}
                </Text>
              </View>
            </View>

            {/* Product Details */}
            <VStack className="flex-1" space="xs">
              <Heading size="sm" style={{ color: colors.text, lineHeight: 20 }}>
                {item.product.name}
              </Heading>
              <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                ${item.product.price.toFixed(2)} each
              </Text>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                Total: ${itemTotal.toFixed(2)}
              </Text>
            </VStack>

            {/* Remove Button */}
            <Pressable
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: colors.surfaceSecondary,
              }}
            >
              <Icon as={Trash2} size="sm" style={{ color: colors.error }} />
            </Pressable>
          </HStack>

          {/* Quantity Controls */}
          <HStack className="justify-between items-center">
            <Text style={{ color: colors.textSecondary, fontWeight: '500' }}>Quantity:</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.surfaceSecondary,
              borderRadius: 8,
              padding: 4
            }}>
              <Pressable
                onPress={() => decreaseQuantity(item.product.id)}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.card,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: item.quantity <= 1 ? 0.5 : 1
                }}
                disabled={item.quantity <= 1}
              >
                <Icon 
                  as={Minus} 
                  size="xs" 
                  style={{ 
                    color: item.quantity <= 1 ? colors.textTertiary : colors.text 
                  }} 
                />
              </Pressable>
              
              <Text style={{
                minWidth: 40,
                textAlign: 'center',
                fontWeight: '600',
                color: colors.text,
                marginHorizontal: 8
              }}>
                {item.quantity}
              </Text>
              
              <Pressable
                onPress={() => increaseQuantity(item.product.id)}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: colors.card,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.border
                }}
              >
                <Icon as={Plus} size="xs" style={{ color: colors.text }} />
              </Pressable>
            </View>
          </HStack>
        </VStack>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <VStack space="md" className="mb-4">
            <HStack className="justify-between items-center">
              <VStack>
                <Heading size="lg" style={{ color: colors.text }}>
                  Shopping Cart
                </Heading>
                <View style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  alignSelf: 'flex-start',
                  marginTop: 4
                }}>
                  <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </VStack>
              
              {/* Clear All Button */}
              <Pressable
                onPress={handleClearAllItems}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.error + '15',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.error + '30'
                }}
              >
                <Icon as={Trash} size="sm" style={{ color: colors.error, marginRight: 8 }} />
                <Text style={{ color: colors.error, fontWeight: '500', fontSize: 14 }}>
                  Clear All
                </Text>
              </Pressable>
            </HStack>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
          </VStack>
        }
        ListFooterComponent={
          <VStack space="lg" className="mt-4">
            {/* Order Summary */}
            <View style={{
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
            }}>
              <VStack space="md">
                <Heading size="md" style={{ color: colors.text, marginBottom: 8 }}>
                  Order Summary
                </Heading>
                
                <VStack space="sm">
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>
                      Subtotal ({totalQuantity} items)
                    </Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      ${subtotal.toFixed(2)}
                    </Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>Shipping</Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      {shipping === 0 ? (
                        <Text style={{ color: colors.success }}>FREE</Text>
                      ) : (
                        `${shipping.toFixed(2)}`
                      )}
                    </Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>Tax</Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      ${tax.toFixed(2)}
                    </Text>
                  </HStack>
                  
                  <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
                  
                  <HStack className="justify-between">
                    <Heading size="md" style={{ color: colors.text }}>Total</Heading>
                    <Heading size="md" style={{ color: colors.primary }}>
                      ${finalTotal.toFixed(2)}
                    </Heading>
                  </HStack>
                </VStack>

                {shipping > 0 && (
                  <Text style={{ 
                    fontSize: 14, 
                    color: colors.textTertiary, 
                    marginTop: 8 
                  }}>
                    💡 Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </Text>
                )}
              </VStack>
            </View>

            {/* Action Buttons */}
            <VStack space="sm">
              <Button
                size="lg"
                onPress={onCheckOut}
                disabled={createOrderMutation.isPending}
                style={{
                  backgroundColor: colors.primary,
                  opacity: createOrderMutation.isPending ? 0.7 : 1
                }}
              >
                <Icon as={CreditCard} size="sm" style={{ color: colors.textInverse, marginRight: 8 }} />
                <ButtonText style={{ color: colors.textInverse, fontWeight: '600' }}>
                  {createOrderMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
                </ButtonText>
              </Button>
              
              <Link href="/" asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: 'transparent'
                  }}
                >
                  <Icon as={ArrowLeft} size="sm" style={{ color: colors.primary, marginRight: 8 }} />
                  <ButtonText style={{ color: colors.primary }}>Continue Shopping</ButtonText>
                </Button>
              </Link>

            </VStack>
          </VStack>
        }
      />

      {/* Enhanced Clear All Confirmation Dialog */}
      <Modal
        visible={showClearDialog}
        transparent={true}
        animationType="none"
        onRequestClose={handleCancelClear}
        statusBarTranslucent={true}
      >
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: screenWidth,
          height: screenHeight,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          opacity: fadeAnim,
        }}>
          <Pressable 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={handleCancelClear}
          />
          
          <Animated.View style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
            transform: [{ scale: scaleAnim }],
          }}>
            {/* Warning Icon */}
            <View style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.error + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon as={Trash} size="xl" style={{ color: colors.error }} />
              </View>
              
              <Heading size="xl" style={{ 
                color: colors.text, 
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Clear Cart
              </Heading>
            </View>

            {/* Message */}
            <Text style={{ 
              color: colors.textSecondary, 
              fontSize: 16,
              lineHeight: 24,
              textAlign: 'center',
              marginBottom: 32,
            }}>
              Are you sure you want to remove all{' '}
              <Text style={{ fontWeight: 'bold', color: colors.text }}>
                {totalQuantity} items
              </Text>
              {' '}from your cart? This action cannot be undone.
            </Text>

            {/* Action Buttons */}
            <VStack space="md">
              <Button
                onPress={handleConfirmClear}
                disabled={isClearing}
                style={{
                  backgroundColor: colors.error,
                  opacity: isClearing ? 0.7 : 1,
                  height: 48,
                }}
              >
                <HStack space="sm" className="items-center">
                  {isClearing ? (
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: colors.textInverse + '30',
                      borderTopColor: colors.textInverse,
                    }} />
                  ) : (
                    <Icon as={Trash} size="sm" style={{ color: colors.textInverse }} />
                  )}
                  <ButtonText style={{ 
                    color: colors.textInverse,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                    {isClearing ? 'Clearing...' : 'Clear All Items'}
                  </ButtonText>
                </HStack>
              </Button>
              
              <Button
                variant="outline"
                onPress={handleCancelClear}
                disabled={isClearing}
                style={{
                  borderColor: colors.border,
                  backgroundColor: 'transparent',
                  height: 48,
                  opacity: isClearing ? 0.5 : 1,
                }}
              >
                <ButtonText style={{ 
                  color: colors.textSecondary,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  Cancel
                </ButtonText>
              </Button>
            </VStack>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Clear All Confirmation Dialog */}
      {/* <ReusableDialog
        isOpen={showClearDialog}
        onClose={handleCancelClear}
        title="Clear Cart"
        message={`Are you sure you want to remove all ${totalQuantity} items from your cart? This action cannot be undone.`}
        type="confirm"
        onConfirm={handleConfirmClear}
        confirmText="Clear All"
        cancelText="Cancel"
        showCloseButton={true}
        closeOnBackdropPress={true}
      /> */}
    </View>
  );
}