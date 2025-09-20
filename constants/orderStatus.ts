import type { TFunction } from 'i18next';

/**
 * Order Status Constants and Utilities
 * 
 * This module provides a comprehensive set of constants, types, and utilities
 * for managing order statuses throughout the application.
 */

// ============================================================================
// CORE CONSTANTS
// ============================================================================

/**
 * Order status enumeration
 * Defines all possible order statuses in the system
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

/**
 * Order status type derived from ORDER_STATUS constant
 */
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * Icon mapping for each order status
 * Used for UI components that display status icons
 */
export const ORDER_STATUS_ICONS = {
  [ORDER_STATUS.NEW]: 'shopping-cart',
  [ORDER_STATUS.CONFIRMED]: 'check-circle',
  [ORDER_STATUS.PROCESSING]: 'package',
  [ORDER_STATUS.SHIPPED]: 'truck',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'map-pin',
  [ORDER_STATUS.DELIVERED]: 'check-circle-2',
  [ORDER_STATUS.CANCELLED]: 'x-circle',
  [ORDER_STATUS.RETURNED]: 'rotate-ccw',
} as const;

/**
 * Color mapping for each order status
 * Provides consistent theming across the application
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.NEW]: '#3B82F6',           // Blue
  [ORDER_STATUS.CONFIRMED]: '#10B981',     // Green
  [ORDER_STATUS.PROCESSING]: '#F59E0B',    // Amber
  [ORDER_STATUS.SHIPPED]: '#8B5CF6',       // Purple
  [ORDER_STATUS.OUT_FOR_DELIVERY]: '#EF4444', // Red
  [ORDER_STATUS.DELIVERED]: '#059669',     // Emerald
  [ORDER_STATUS.CANCELLED]: '#6B7280',     // Gray
  [ORDER_STATUS.RETURNED]: '#DC2626',      // Red
} as const;

/**
 * Translation key mapping for order statuses
 * Maps status values to their corresponding translation keys
 */
const STATUS_TRANSLATION_KEYS = {
  [ORDER_STATUS.NEW]: 'new',
  [ORDER_STATUS.CONFIRMED]: 'confirmed',
  [ORDER_STATUS.PROCESSING]: 'processing',
  [ORDER_STATUS.SHIPPED]: 'shipped',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'outForDelivery',
  [ORDER_STATUS.DELIVERED]: 'delivered',
  [ORDER_STATUS.CANCELLED]: 'cancelled',
  [ORDER_STATUS.RETURNED]: 'returned',
} as const;

// ============================================================================
// TIMELINE CONFIGURATION
// ============================================================================

/**
 * Order timeline steps for normal order progression
 * Excludes cancelled and returned statuses as they are not part of normal flow
 */
export const ORDER_TIMELINE_STEPS = [
  {
    status: ORDER_STATUS.NEW,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.NEW],
    order: 0,
  },
  {
    status: ORDER_STATUS.CONFIRMED,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.CONFIRMED],
    order: 1,
  },
  {
    status: ORDER_STATUS.PROCESSING,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.PROCESSING],
    order: 2,
  },
  {
    status: ORDER_STATUS.SHIPPED,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.SHIPPED],
    order: 3,
  },
  {
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.OUT_FOR_DELIVERY],
    order: 4,
  },
  {
    status: ORDER_STATUS.DELIVERED,
    icon: ORDER_STATUS_ICONS[ORDER_STATUS.DELIVERED],
    order: 5,
  },
] as const;

/**
 * Timeline step type
 */
export type TimelineStep = typeof ORDER_TIMELINE_STEPS[number];

// ============================================================================
// STATUS CLASSIFICATION
// ============================================================================

/**
 * Active statuses that indicate the order is still in progress
 */
export const ACTIVE_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
] as const;

/**
 * Final statuses that indicate the order has reached a terminal state
 */
export const FINAL_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.RETURNED,
] as const;

/**
 * Statuses that can be tracked in the timeline
 */
export const TRACKABLE_STATUSES: readonly OrderStatus[] = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the timeline index of a status
 * Returns -1 if status is not in the timeline
 */
export const getStatusTimelineIndex = (status: OrderStatus): number => {
  return ORDER_TIMELINE_STEPS.findIndex(step => step.status === status);
};

/**
 * Check if a status is part of the normal timeline progression
 */
export const isTrackableStatus = (status: OrderStatus): boolean => {
  return TRACKABLE_STATUSES.includes(status);
};

/**
 * Check if a status is active (order still in progress)
 */
export const isActiveStatus = (status: OrderStatus): boolean => {
  return ACTIVE_STATUSES.includes(status);
};

/**
 * Check if a status is final (order completed/terminated)
 */
export const isFinalStatus = (status: OrderStatus): boolean => {
  return FINAL_STATUSES.includes(status);
};

/**
 * Check if a status is completed in the timeline relative to another status
 */
export const isStatusCompleted = (currentStatus: OrderStatus, checkStatus: OrderStatus): boolean => {
  const currentIndex = getStatusTimelineIndex(currentStatus);
  const checkIndex = getStatusTimelineIndex(checkStatus);
  
  // If either status is not in timeline, handle edge cases
  if (currentIndex === -1 || checkIndex === -1) {
    return false;
  }
  
  return currentIndex >= checkIndex;
};

/**
 * Get all completed statuses based on current status
 */
export const getCompletedStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  const currentIndex = getStatusTimelineIndex(currentStatus);
  
  if (currentIndex === -1) {
    return [];
  }
  
  return ORDER_TIMELINE_STEPS
    .slice(0, currentIndex + 1)
    .map(step => step.status);
};

/**
 * Get the next status in the timeline
 */
export const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const currentIndex = getStatusTimelineIndex(currentStatus);
  
  if (currentIndex === -1 || currentIndex >= ORDER_TIMELINE_STEPS.length - 1) {
    return null;
  }
  
  return ORDER_TIMELINE_STEPS[currentIndex + 1].status;
};

/**
 * Get the previous status in the timeline
 */
export const getPreviousStatus = (currentStatus: OrderStatus): OrderStatus | null => {
  const currentIndex = getStatusTimelineIndex(currentStatus);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return ORDER_TIMELINE_STEPS[currentIndex - 1].status;
};

/**
 * Calculate progress percentage based on current status
 */
export const getStatusProgress = (status: OrderStatus): number => {
  const index = getStatusTimelineIndex(status);
  
  if (index === -1) {
    return 0;
  }
  
  return Math.round(((index + 1) / ORDER_TIMELINE_STEPS.length) * 100);
};

// ============================================================================
// TRANSLATION UTILITIES
// ============================================================================

/**
 * Get translated status name
 */
export const getTranslatedStatusName = (t: TFunction, status: OrderStatus): string => {
  const key = STATUS_TRANSLATION_KEYS[status];
  return key ? t(`orders.status.${key}`) : status;
};

/**
 * Get translated status title (for timeline display)
 */
export const getTranslatedStatusTitle = (t: TFunction, status: OrderStatus): string => {
  const key = STATUS_TRANSLATION_KEYS[status];
  return key ? t(`orders.statusTitles.${key}`) : status;
};

/**
 * Get translated status description
 */
export const getTranslatedStatusDescription = (t: TFunction, status: OrderStatus): string => {
  const key = STATUS_TRANSLATION_KEYS[status];
  return key ? t(`orders.statusDescriptions.${key}`) : '';
};

/**
 * Get translated timeline steps with all necessary data
 */
export const getTranslatedTimelineSteps = (t: TFunction) => {
  return ORDER_TIMELINE_STEPS.map(step => ({
    status: step.status,
    title: getTranslatedStatusTitle(t, step.status),
    description: getTranslatedStatusDescription(t, step.status),
    icon: step.icon,
    order: step.order,
    color: ORDER_STATUS_COLORS[step.status],
  }));
};

// ============================================================================
// LEGACY SUPPORT (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use ORDER_TIMELINE_STEPS instead
 * Legacy timeline steps with hardcoded English text
 * Kept for backward compatibility
 */
export const ORDER_TIMELINE_STEPS_LEGACY = [
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

/**
 * @deprecated Use ORDER_TIMELINE_STEPS instead
 * Base timeline steps without translations
 */
export const ORDER_TIMELINE_STEPS_BASE = ORDER_TIMELINE_STEPS.map(({ status, icon }) => ({
  status,
  icon,
}));

/**
 * @deprecated Use getStatusTimelineIndex instead
 */
export const getStatusIndex = getStatusTimelineIndex;