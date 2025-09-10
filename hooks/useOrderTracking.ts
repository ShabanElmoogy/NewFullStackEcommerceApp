import { useState, useEffect, useCallback } from 'react';
import { getOrderById, Order } from '@/api/orders';
import { OrderStatus } from '@/constants/orderStatus';

interface UseOrderTrackingProps {
  orderId: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseOrderTrackingReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refreshOrder: () => Promise<void>;
  isRefreshing: boolean;
}

export function useOrderTracking({ 
  orderId, 
  autoRefresh = false, 
  refreshInterval = 30000 // 30 seconds
}: UseOrderTrackingProps): UseOrderTrackingReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [orderId]);

  const refreshOrder = useCallback(async () => {
    await fetchOrder(true);
  }, [fetchOrder]);

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !order) return;

    const interval = setInterval(() => {
      // Only auto-refresh if order is not delivered or cancelled
      if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
        fetchOrder(true);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, order, fetchOrder]);

  return {
    order,
    loading,
    error,
    refreshOrder,
    isRefreshing,
  };
}

// Hook for tracking multiple orders
export function useOrdersTracking(orderIds: number[]) {
  const [orders, setOrders] = useState<Record<number, Order>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const orderPromises = orderIds.map(id => getOrderById(id));
      const orderResults = await Promise.allSettled(orderPromises);
      
      const ordersMap: Record<number, Order> = {};
      
      orderResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          ordersMap[orderIds[index]] = result.value;
        }
      });
      
      setOrders(ordersMap);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [orderIds]);

  useEffect(() => {
    if (orderIds.length > 0) {
      fetchOrders();
    }
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
  };
}