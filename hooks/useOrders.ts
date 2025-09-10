import { useQuery } from '@tanstack/react-query';
import { getUserOrders, getOrderById, Order } from '@/api/orders';
import { useAuth } from '@/store/authStore';

export function useUserOrders() {
  const { user, isAuthenticated } = useAuth();
  
  return useQuery<Order[]>({
    queryKey: ['orders', 'user', user?.id || user?.userId],
    queryFn: () => {
      console.log('useUserOrders: Fetching orders for user:', user);
      return getUserOrders();
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.log('useUserOrders: Retry attempt', failureCount, 'Error:', error);
      return failureCount < 3;
    },
    onError: (error) => {
      console.error('useUserOrders: Query failed:', error);
    },
    onSuccess: (data) => {
      console.log('useUserOrders: Query successful, orders count:', data?.length);
    }
  });
}

export function useOrder(orderId: number) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<Order>({
    queryKey: ['orders', orderId],
    queryFn: () => {
      console.log('useOrder: Fetching order details for ID:', orderId);
      return getOrderById(orderId);
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.log('useOrder: Retry attempt', failureCount, 'Error:', error);
      return failureCount < 3;
    },
    onError: (error) => {
      console.error('useOrder: Query failed:', error);
    },
    onSuccess: (data) => {
      console.log('useOrder: Query successful, order data:', data);
    }
  });
}