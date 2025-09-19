import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getUserOrders, getOrderById, Order } from '@/api/orders';
import { useAuth } from '@/store/authStore';

export function useUserOrders() {
  const { user, isAuthenticated } = useAuth();
  
  const query = useQuery<Order[]>({
    queryKey: ['orders', 'user', user?.id || user?.userId],
    queryFn: () => {
      return getUserOrders();
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
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
    }
  }, [query.isSuccess, query.data]);

  return query;
}

export function useOrder(orderId: number) {
  const { isAuthenticated } = useAuth();
  
  const query = useQuery<Order>({
    queryKey: ['orders', orderId],
    queryFn: () => {
      return getOrderById(orderId);
    },
    enabled: isAuthenticated && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
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
    }
  }, [query.isSuccess, query.data]);

  return query;
}
