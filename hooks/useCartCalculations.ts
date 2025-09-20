import { useMemo } from 'react';
import { useCart, CartItem } from '@/store/cartStore';

// Simple cart calculations hook
export function useCartCalculations() {
  const items = useCart((state) => state.items);
  
  return useMemo(() => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const finalTotal = subtotal + shipping + tax;
    
    return {
      totalQuantity,
      subtotal,
      shipping,
      tax,
      finalTotal,
    };
  }, [items]);
}

// Simple item calculations hook
export function useCartItemCalculations(item: CartItem) {
  return useMemo(() => {
    const itemTotal = item.quantity * item.product.price;
    
    return {
      itemTotal,
      formattedTotal: `${itemTotal.toFixed(2)}`,
      formattedUnitPrice: `${item.product.price.toFixed(2)}`,
    };
  }, [item]);
}

// Simple cart summary hook
export function useCartSummary() {
  const calculations = useCartCalculations();
  
  return useMemo(() => {
    const freeShippingMessage = calculations.shipping > 0 
      ? `💡 Add ${(100 - calculations.subtotal).toFixed(2)} more for free shipping!`
      : null;
    
    return {
      ...calculations,
      freeShippingMessage,
    };
  }, [calculations]);
}