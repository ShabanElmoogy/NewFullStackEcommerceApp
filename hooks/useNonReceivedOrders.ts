import { useMemo } from 'react';
import { useUserOrders } from './useOrders';
import { ORDER_STATUS, OrderStatus } from '@/constants/orderStatus';

// Define what constitutes "non-received" orders
const NON_RECEIVED_STATUSES: OrderStatus[] = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
];

export function useNonReceivedOrders() {
  const { data: orders, isLoading, error, refetch } = useUserOrders();

  const nonReceivedOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => 
      NON_RECEIVED_STATUSES.includes(order.status as OrderStatus) && 
      !order.isDeleted
    );
  }, [orders]);

  const nonReceivedCount = nonReceivedOrders.length;

  // Get the most recent non-received order
  const latestNonReceivedOrder = useMemo(() => {
    if (nonReceivedOrders.length === 0) return null;
    
    return nonReceivedOrders.reduce((latest, current) => {
      const latestDate = new Date(latest.createdOn);
      const currentDate = new Date(current.createdOn);
      return currentDate > latestDate ? current : latest;
    });
  }, [nonReceivedOrders]);

  // Get orders by status for detailed breakdown
  const ordersByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    
    nonReceivedOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    return statusCounts;
  }, [nonReceivedOrders]);

  return {
    orders: nonReceivedOrders,
    count: nonReceivedCount,
    latestOrder: latestNonReceivedOrder,
    ordersByStatus,
    isLoading,
    error,
    refetch,
    hasNonReceivedOrders: nonReceivedCount > 0,
  };
}