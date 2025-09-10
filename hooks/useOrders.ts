import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserOrders, getOrderById, Order } from '@/api/orders';
import { useAuth } from '@/store/authStore';

export function useUserOrders() {
  const { user, isAuthenticated } = useAuth();
  
  const query = useQuery<Order[]>({
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
  });

  // Handle success/error side effects
  useEffect(() => {
    if (query.error) {
      console.error('useUserOrders: Query failed:', query.error);
    }
  }, [query.error]);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('useUserOrders: Query successful, orders count:', query.data.length);
    }
  }, [query.isSuccess, query.data]);

  return query;
}

export function useOrder(orderId: number) {
  const { isAuthenticated } = useAuth();
  
  const query = useQuery<Order>({
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
    }
  });

  // Handle success/error side effects
  useEffect(() => {
    if (query.error) {
      console.error('useOrder: Query failed:', query.error);
    }
  }, [query.error]);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('useOrder: Query successful, order data:', query.data);
    }
  }, [query.isSuccess, query.data]);

  return query;
}