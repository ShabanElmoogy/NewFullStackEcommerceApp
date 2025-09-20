import { useCart } from '@/store/cartStore';
import React, { useEffect } from 'react';
import { FlatList, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useCartCheckout } from '@/hooks/useCartCheckout';
import { useCartSummary } from '@/hooks/useCartCalculations';
import { useAuth } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import {
  CartItem,
  CartHeader,
  CartSummary,
  CartFooter,
  EmptyCart,
  ClearCartDialog,
  CheckoutDialog
} from '@/components/cart';

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

  // Use cart calculations hook
  const cartSummary = useCartSummary();
  const {
    totalQuantity,
    subtotal,
    shipping,
    tax,
    finalTotal,
    freeShippingMessage,
  } = cartSummary;

  useEffect(() => {
    if (!isAuthenticated) {
      setReturnUrl('/cart');
      router.replace('/login');
    }
  }, [isAuthenticated, setReturnUrl, router]);

  // Use the cart checkout hook
  const { createOrder, isCreatingOrder } = useCartCheckout();

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
    createOrder();
  };

  const handleCancelCheckout = () => {
    setShowCheckoutDialog(false);
  };

  // Empty cart state
  if (items.length === 0) {
    return <EmptyCart />;
  }

  const renderCartItem = ({ item }) => (
    <CartItem
      item={item}
      onRemove={handleRemoveItem}
      onIncreaseQuantity={increaseQuantity}
      onDecreaseQuantity={decreaseQuantity}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <CartHeader 
        totalQuantity={totalQuantity}
        onClearAll={handleClearAllItems}
      />

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
              <CartSummary
                totalQuantity={totalQuantity}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                finalTotal={finalTotal}
                freeShippingMessage={freeShippingMessage}
              />
            </VStack>
          }
        />
      </View>

      <CartFooter 
        onCheckout={onCheckOut}
        isCreatingOrder={isCreatingOrder}
      />

      <ClearCartDialog
        visible={showClearDialog}
        totalQuantity={totalQuantity}
        isClearing={isClearing}
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
      />

      <CheckoutDialog
        visible={showCheckoutDialog}
        totalQuantity={totalQuantity}
        subtotal={subtotal}
        shipping={shipping}
        tax={tax}
        finalTotal={finalTotal}
        isCreatingOrder={isCreatingOrder}
        onConfirm={handleConfirmCheckout}
        onCancel={handleCancelCheckout}
      />
    </View>
  );
}
