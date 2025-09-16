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
import { Redirect, useRouter, Link } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, Trash } from 'lucide-react-native';
import { Image } from '@/components/ui/image';
import { Icon } from '@/components/ui/icon';
import { Divider } from '@/components/ui/divider';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { CustomToast } from '@/components/CustomToast';
import { ConfirmationToast } from '@/components/ConfirmationToast';
import { useAuth } from '@/store/authStore';
import { SafeToast } from '@/components/SafeToast';

export default function CartScreen() {
  const items = useCart((state) => state.items);
  const removeProduct = useCart((state) => state.removeProduct);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);
  const resetCart = useCart((state) => state.resetCart);
  const router = useRouter();

  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const setReturnUrl = useAuth(s => s.setReturnUrl);

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
      router.replace('/(auth)/login');
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
    //TODO: Add Toast
    // toast.show({
    //   placement: "top",
    //   duration: 8000,
    //   render: ({ id }) => (
    //     <SafeToast placement="top">
    //       <ConfirmationToast
    //         id={id}
    //         title="Clear Cart"
    //         message={`Are you sure you want to remove all ${totalQuantity} items from your cart? This action cannot be undone.`}
    //         onConfirm={() => {
    //           console.log('Clearing all items from cart');
    //           resetCart();
    //           toast.close(id);
    //           toast.show({
    //             placement: "bottom",
    //             duration: 3000,
    //             render: ({ id: successId }) => (
    //               <CustomToast id={successId} message="Cart cleared successfully" />
    //             ),
    //           });
    //         }}
    //         onCancel={() => {
    //           console.log('Clear all cancelled');
    //           toast.close(id);
    //         }}
    //         confirmText="Clear All"
    //         cancelText="Cancel"
    //         type="danger"
    //       />
    //     </SafeToast>
    //   ),
    // });
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
      <View className="flex-1 justify-center items-center p-6 bg-background-0">
        <VStack className="items-center" space="lg">
          <View className="w-24 h-24 bg-background-100 rounded-full items-center justify-center">
            <Icon as={ShoppingBag} size="xl" className="text-typography-400" />
          </View>
          <VStack className="items-center" space="sm">
            <Heading size="xl" className="text-typography-900">Your cart is empty</Heading>
            <Text className="text-typography-600 text-center max-w-[280px]">
              Looks like you haven't added any items to your cart yet
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

  const renderCartItem = ({ item, index }) => {
    const itemTotal = item.quantity * item.product.price;
    
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
                className="absolute -top-2 -right-2 bg-primary-500"
              >
                <BadgeText className="text-white">{item.quantity}</BadgeText>
              </Badge>
            </View>

            {/* Product Details */}
            <VStack className="flex-1" space="xs">
              <Heading size="sm" className="text-typography-900 leading-tight">
                {item.product.name}
              </Heading>
              <Text className="text-typography-600 text-sm">
                ${item.product.price.toFixed(2)} each
              </Text>
              <Text className="text-primary-600 font-semibold">
                Total: ${itemTotal.toFixed(2)}
              </Text>
            </VStack>

            {/* Remove Button */}
            <Pressable
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
              className="p-2 rounded-full active:bg-background-100"
            >
              <Icon as={Trash2} size="sm" className="text-error-500" />
            </Pressable>
          </HStack>

          {/* Quantity Controls */}
          <HStack className="justify-between items-center">
            <Text className="text-typography-600 font-medium">Quantity:</Text>
            <HStack className="items-center bg-background-50 rounded-lg p-1" space="xs">
              <Pressable
                onPress={() => decreaseQuantity(item.product.id)}
                className="w-8 h-8 bg-background-0 rounded-md items-center justify-center border border-outline-200 active:bg-background-100"
                disabled={item.quantity <= 1}
              >
                <Icon 
                  as={Minus} 
                  size="xs" 
                  className={item.quantity <= 1 ? "text-typography-300" : "text-typography-700"} 
                />
              </Pressable>
              
              <Text className="min-w-[40px] text-center font-semibold text-typography-900">
                {item.quantity}
              </Text>
              
              <Pressable
                onPress={() => increaseQuantity(item.product.id)}
                className="w-8 h-8 bg-background-0 rounded-md items-center justify-center border border-outline-200 active:bg-background-100"
              >
                <Icon as={Plus} size="xs" className="text-typography-700" />
              </Pressable>
            </HStack>
          </HStack>
        </VStack>
      </Card>
    );
  };

  return (
    <View className="flex-1 bg-background-50">
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
                <Heading size="lg" className="text-typography-900">
                  Shopping Cart
                </Heading>
                <Badge variant="outline" size="md" className="self-start mt-1">
                  <BadgeText>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</BadgeText>
                </Badge>
              </VStack>
              
              {/* Clear All Button */}
              <Pressable
                onPress={handleClearAllItems}
                className="flex-row items-center bg-error-50 px-3 py-2 rounded-lg border border-error-200 active:bg-error-100"
              >
                <Icon as={Trash} size="sm" className="text-error-600 mr-2" />
                <Text className="text-error-600 font-medium text-sm">Clear All</Text>
              </Pressable>
            </HStack>
            <Divider />
          </VStack>
        }
        ListFooterComponent={
          <VStack space="lg" className="mt-4">
            {/* Order Summary */}
            <Card className="p-4 bg-background-0 border border-outline-200">
              <VStack space="md">
                <Heading size="md" className="text-typography-900 mb-2">
                  Order Summary
                </Heading>
                
                <VStack space="sm">
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Subtotal ({totalQuantity} items)</Text>
                    <Text className="font-semibold">${subtotal.toFixed(2)}</Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Shipping</Text>
                    <Text className="font-semibold">
                      {shipping === 0 ? (
                        <Text className="text-success-600">FREE</Text>
                      ) : (
                        `${shipping.toFixed(2)}`
                      )}
                    </Text>
                  </HStack>
                  
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Tax</Text>
                    <Text className="font-semibold">${tax.toFixed(2)}</Text>
                  </HStack>
                  
                  <Divider className="my-2" />
                  
                  <HStack className="justify-between">
                    <Heading size="md" className="text-typography-900">Total</Heading>
                    <Heading size="md" className="text-primary-600">
                      ${finalTotal.toFixed(2)}
                    </Heading>
                  </HStack>
                </VStack>

                {shipping > 0 && (
                  <Text className="text-sm text-typography-500 mt-2">
                    💡 Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </Text>
                )}
              </VStack>
            </Card>

            {/* Action Buttons */}
            <VStack space="sm">
              <Button
                size="lg"
                onPress={onCheckOut}
                disabled={createOrderMutation.isPending}
                className="bg-primary-600"
              >
                <Icon as={CreditCard} size="sm" className="text-white mr-2" />
                <ButtonText className="text-white font-semibold">
                  {createOrderMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
                </ButtonText>
              </Button>
              
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