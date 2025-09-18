import { useCart } from '@/store/cartStore';
import React, { useEffect } from 'react';
import { FlatList, View, StatusBar, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Trash } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { useAuth } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const removeProduct = useCart((state) => state.removeProduct);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);
  const resetCart = useCart((state) => state.resetCart);
  const router = useRouter();

  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const setReturnUrl = useAuth(s => s.setReturnUrl);

  // Safe area insets
  const insets = useSafeAreaInsets();

  // Theme colors
  const { colors, isDark } = useTheme();

  // Dialog state for clear all confirmation
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  const [isClearing, setIsClearing] = React.useState(false);
  
  // Dialog state for checkout confirmation
  const [showCheckoutDialog, setShowCheckoutDialog] = React.useState(false);

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

      Toast.show({
        type: ToastType.SUCCESS,
        text1: "🛒 Added to Cart!",
        text2: "Order placed successfully! 🎉",
        visibilityTime: 3000,
      });
      
      router.push('/');
    },

    onError: (error) => {      
      Toast.show({
        type: ToastType.SUCCESS,
        text1: "🛒 Added to Cart!",
        text2: `Failed to place order: ${error.message}`,
        visibilityTime: 3000,
      });
    }
  });

  const handleRemoveItem = (productId: number, productName: string) => {
    removeProduct(productId);
  };

  const handleClearAllItems = () => {
    setShowClearDialog(true);
  };

  const handleConfirmClear = async () => {
    setIsClearing(true);

    // Add a small delay for better UX
    setTimeout(() => {
      resetCart();
      setIsClearing(false);
      setShowClearDialog(false);
    }, 500);
  };

  const handleCancelClear = () => {
    setShowClearDialog(false);
  };

  const onCheckOut = () => {    
    setShowCheckoutDialog(true);
  };

  const handleConfirmCheckout = () => {
    setShowCheckoutDialog(false);
    createOrderMutation.mutate();
  };

  const handleCancelCheckout = () => {
    console.log('Order cancelled');
    setShowCheckoutDialog(false);
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
            <Link href="/products" asChild>
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
      
      {/* Fixed Header */}
      <View style={{
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <VStack space="md">
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
        </VStack>
      </View>

      {/* Scrollable Cart Items */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.product.id.toString()}
          contentContainerStyle={{ 
            padding: 16,
            paddingBottom: Math.max(140, insets.bottom + 120), // Dynamic padding based on footer height + safe area
          }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          ListFooterComponent={
            <VStack space="lg" className="mt-4">
              {/* Order Summary - Now scrolls with content */}
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
            </VStack>
          }
        />
      </View>

      {/* Fixed Footer - Only Action Buttons */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: Math.max(16, insets.bottom + 8), // Ensure buttons don't go off screen
      }}>
        {/* Action Buttons Only */}
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
      </View>

      {/* Clear All Confirmation Dialog */}
      <Modal
        visible={showClearDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelClear}
        statusBarTranslucent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={handleCancelClear}
          />

          <View style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 1000,
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
          </View>
        </View>
      </Modal>

      {/* Checkout Confirmation Dialog */}
      <Modal
        visible={showCheckoutDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelCheckout}
        statusBarTranslucent={true}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <Pressable
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={handleCancelCheckout}
          />

          <View style={{
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 1000,
          }}>
            {/* Checkout Icon */}
            <View style={{
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon as={CreditCard} size="xl" style={{ color: colors.primary }} />
              </View>

              <Heading size="xl" style={{
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Confirm Order
              </Heading>
            </View>

            {/* Order Details */}
            <VStack space="md" style={{ marginBottom: 24 }}>
              <Text style={{
                color: colors.textSecondary,
                fontSize: 16,
                lineHeight: 24,
                textAlign: 'center',
              }}>
                You're about to place an order for{' '}
                <Text style={{ fontWeight: 'bold', color: colors.text }}>
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                </Text>
              </Text>

              {/* Order Summary in Dialog */}
              <View style={{
                backgroundColor: colors.surfaceSecondary,
                borderRadius: 12,
                padding: 16,
                marginTop: 8,
              }}>
                <VStack space="sm">
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>Subtotal:</Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      ${subtotal.toFixed(2)}
                    </Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>Shipping:</Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      {shipping === 0 ? (
                        <Text style={{ color: colors.success }}>FREE</Text>
                      ) : (
                        `${shipping.toFixed(2)}`
                      )}
                    </Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text style={{ color: colors.textSecondary }}>Tax:</Text>
                    <Text style={{ fontWeight: '600', color: colors.text }}>
                      ${tax.toFixed(2)}
                    </Text>
                  </HStack>
                  
                  <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
                  
                  <HStack className="justify-between">
                    <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 16 }}>
                      Total:
                    </Text>
                    <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 18 }}>
                      ${finalTotal.toFixed(2)}
                    </Text>
                  </HStack>
                </VStack>
              </View>
            </VStack>

            {/* Action Buttons */}
            <VStack space="md">
              <Button
                onPress={handleConfirmCheckout}
                disabled={createOrderMutation.isPending}
                style={{
                  backgroundColor: colors.primary,
                  opacity: createOrderMutation.isPending ? 0.7 : 1,
                  height: 48,
                }}
              >
                <HStack space="sm" className="items-center">
                  {createOrderMutation.isPending ? (
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: colors.textInverse + '30',
                      borderTopColor: colors.textInverse,
                    }} />
                  ) : (
                    <Icon as={CreditCard} size="sm" style={{ color: colors.textInverse }} />
                  )}
                  <ButtonText style={{
                    color: colors.textInverse,
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                    {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                  </ButtonText>
                </HStack>
              </Button>

              <Button
                variant="outline"
                onPress={handleCancelCheckout}
                disabled={createOrderMutation.isPending}
                style={{
                  borderColor: colors.border,
                  backgroundColor: 'transparent',
                  height: 48,
                  opacity: createOrderMutation.isPending ? 0.5 : 1,
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
          </View>
        </View>
      </Modal>
    </View>
  );
}