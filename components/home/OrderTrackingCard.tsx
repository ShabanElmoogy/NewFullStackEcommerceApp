import React, { useCallback, useState } from 'react';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { RTLChevronRight } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { useNonReceivedOrders } from '@/hooks/useNonReceivedOrders';
import { useRouter } from 'expo-router';
import { ORDER_STATUS, ORDER_STATUS_COLORS } from '@/constants/orderStatus';
import { OrderTrackingHeader } from './order-tracking/OrderTrackingHeader';
import { OrderTrackingContent } from './order-tracking/OrderTrackingContent';
import { OrderStatusBreakdown } from './order-tracking/OrderStatusBreakdown';
import { OrderTrackingFooter } from './order-tracking/OrderTrackingFooter';
import { OrderTrackingLoader } from './order-tracking/OrderTrackingLoader';

interface OrderTrackingCardProps {
  onNavigate?: (route: string) => void;
}

export default function OrderTrackingCard({ onNavigate }: OrderTrackingCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const { 
    count, 
    latestOrder, 
    ordersByStatus, 
    hasNonReceivedOrders, 
    isLoading 
  } = useNonReceivedOrders();

  // Fix delay with immediate state update using flushSync for synchronous updates
  const handlePress = useCallback(() => {
    if (isNavigating) return; // Prevent multiple presses
    
    // Set loading state immediately and force synchronous update
    setIsNavigating(true);
    
    // Use requestAnimationFrame to ensure the UI updates before navigation
    requestAnimationFrame(() => {
      try {
        const route = '/orders?filter=non-received';
        if (onNavigate) {
          onNavigate(route);
        } else {
          router.push(route as any);
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
      
      // Reset loading state after a short delay
      setTimeout(() => setIsNavigating(false), 600);
    });
  }, [onNavigate, router, isNavigating]);

  // Get status color based on priority
  const getStatusColor = () => {
    // Priority order: most urgent status first
    if (ordersByStatus[ORDER_STATUS.OUT_FOR_DELIVERY] > 0) return ORDER_STATUS_COLORS[ORDER_STATUS.OUT_FOR_DELIVERY];
    if (ordersByStatus[ORDER_STATUS.SHIPPED] > 0) return ORDER_STATUS_COLORS[ORDER_STATUS.SHIPPED];
    if (ordersByStatus[ORDER_STATUS.PROCESSING] > 0) return ORDER_STATUS_COLORS[ORDER_STATUS.PROCESSING];
    if (ordersByStatus[ORDER_STATUS.CONFIRMED] > 0) return ORDER_STATUS_COLORS[ORDER_STATUS.CONFIRMED];
    if (ordersByStatus[ORDER_STATUS.NEW] > 0) return ORDER_STATUS_COLORS[ORDER_STATUS.NEW];
    return colors.textSecondary;
  };

  // Don't render if no orders
  if (!hasNonReceivedOrders && !isLoading) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return <OrderTrackingLoader />;
  }

  const statusColor = getStatusColor();

  return (
    <View className="mx-4 mb-6">
      <Pressable
        onPress={handlePress}
        disabled={isNavigating}
        className="rounded-2xl p-4 border-2 shadow-sm active:scale-98"
        style={{
          backgroundColor: colors.card,
          borderColor: statusColor + '30',
          shadowColor: statusColor,
          opacity: isNavigating ? 0.8 : 1,
        }}
      >
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1" space="md">
            <OrderTrackingHeader 
              statusColor={statusColor}
              latestOrder={latestOrder}
            />

            <OrderTrackingContent
              count={count}
              latestOrder={latestOrder}
              statusColor={statusColor}
            />

            {/* Status Badge */}
            {count > 1 && (
              <View className="px-2 py-1 rounded-full min-w-6 items-center" style={{
                backgroundColor: statusColor,
              }}>
                <Text className="text-xs font-bold" style={{ color: 'white' }}>
                  {count}
                </Text>
              </View>
            )}
          </HStack>

          {/* Arrow Icon */}
          <RTLChevronRight size="lg" className="ml-2" style={{ color: statusColor }} />
        </HStack>

        {/* Enhanced Status Breakdown with Icons and Colors */}
        {count > 1 && (
          <OrderStatusBreakdown 
            ordersByStatus={ordersByStatus}
          />
        )}

        <OrderTrackingFooter 
          isNavigating={isNavigating}
          statusColor={statusColor}
        />
      </Pressable>
    </View>
  );
}