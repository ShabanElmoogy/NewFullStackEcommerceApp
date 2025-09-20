import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/orders';
import { useCart } from '@/store/cartStore';
import { Toast } from 'toastify-react-native';
import { ToastType } from '@/types/toastType';
import { useRouter } from 'expo-router';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export function useCartCheckout() {
  const resetCart = useCart((state) => state.resetCart);
  const items = useCart((state) => state.items);
  const router = useRouter();

  const createOrderMutation = useMutation({
    mutationFn: () => {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      return createOrder(orderItems);
    },
    onSuccess: (data) => {
      resetCart();

      Toast.show({
        type: ToastType.SUCCESS,
        text1: "🎉 Order Placed!",
        text2: "Order placed successfully! 🎉",
        visibilityTime: 3000,
      });
      
      router.push('/');
    },
    onError: (error: any) => {      
      Toast.show({
        type: ToastType.ERROR,
        text1: "❌ Order Failed",
        text2: `Failed to place order: ${error.message}`,
        visibilityTime: 3000,
      });
    }
  });

  return {
    createOrder: createOrderMutation.mutate,
    createOrderAsync: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    isSuccess: createOrderMutation.isSuccess,
    isError: createOrderMutation.isError,
    error: createOrderMutation.error,
    reset: createOrderMutation.reset,
  };
}