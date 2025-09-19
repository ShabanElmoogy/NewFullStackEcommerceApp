/**
 * Order Status Constants
 * Defines order statuses and their timeline progression
 */

export const ORDER_STATUS = {
  NEW: 'New',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// Order status progression timeline
export const ORDER_TIMELINE_STEPS = [
  {
    status: ORDER_STATUS.NEW,
    title: 'Order Placed',
    description: 'Your order has been placed successfully',
    icon: 'shopping-cart',
  },
  {
    status: ORDER_STATUS.CONFIRMED,
    title: 'Order Confirmed',
    description: 'Your order has been confirmed and is being prepared',
    icon: 'check-circle',
  },
  {
    status: ORDER_STATUS.PROCESSING,
    title: 'Processing',
    description: 'Your order is being processed and packed',
    icon: 'package',
  },
  {
    status: ORDER_STATUS.SHIPPED,
    title: 'Shipped',
    description: 'Your order has been shipped and is on its way',
    icon: 'truck',
  },
  {
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    title: 'Out for Delivery',
    description: 'Your order is out for delivery',
    icon: 'map-pin',
  },
  {
    status: ORDER_STATUS.DELIVERED,
    title: 'Delivered',
    description: 'Your order has been delivered successfully',
    icon: 'check-circle-2',
  },
] as const;

// Status colors for UI
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.NEW]: '#3B82F6', // Blue
  [ORDER_STATUS.CONFIRMED]: '#10B981', // Green
  [ORDER_STATUS.PROCESSING]: '#F59E0B', // Amber
  [ORDER_STATUS.SHIPPED]: '#8B5CF6', // Purple
  [ORDER_STATUS.OUT_FOR_DELIVERY]: '#EF4444', // Red
  [ORDER_STATUS.DELIVERED]: '#059669', // Emerald
  [ORDER_STATUS.CANCELLED]: '#6B7280', // Gray
  [ORDER_STATUS.RETURNED]: '#DC2626', // Red
} as const;

// Get the index of a status in the timeline
export const getStatusIndex = (status: OrderStatus): number => {
  return ORDER_TIMELINE_STEPS.findIndex(step => step.status === status);
};

// Check if a status is completed in the timeline
export const isStatusCompleted = (currentStatus: OrderStatus, checkStatus: OrderStatus): boolean => {
  const currentIndex = getStatusIndex(currentStatus);
  const checkIndex = getStatusIndex(checkStatus);
  return currentIndex >= checkIndex;
};

// Get all completed statuses
export const getCompletedStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  const currentIndex = getStatusIndex(currentStatus);
  return ORDER_TIMELINE_STEPS
    .slice(0, currentIndex + 1)
    .map(step => step.status);
};
