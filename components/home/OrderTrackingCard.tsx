import React, { useCallback, useState } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Package, Truck, Clock, ChevronRight, MapPin, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/useTheme';
import { useNonReceivedOrders } from '@/hooks/useNonReceivedOrders';
import { useRouter } from 'expo-router';
import { ORDER_STATUS } from '@/constants/orderStatus';

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

  // Don't render if no orders
  if (!hasNonReceivedOrders && !isLoading) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <View className="mx-4 mb-6">
        <View className="rounded-2xl p-4 border" style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}>
          <HStack className="items-center justify-between">
            <HStack className="items-center" space="md">
              <View className="w-12 h-12 rounded-xl items-center justify-center" style={{
                backgroundColor: colors.primary + '20',
              }}>
                <Icon as={Package} size="lg" style={{ color: colors.primary }} />
              </View>
              <VStack>
                <View className="h-4 w-32 rounded mb-2" style={{ backgroundColor: colors.textTertiary + '20' }} />
                <View className="h-3 w-24 rounded" style={{ backgroundColor: colors.textTertiary + '15' }} />
              </VStack>
            </HStack>
            <Icon as={ChevronRight} size="lg" style={{ color: colors.textTertiary }} />
          </HStack>
        </View>
      </View>
    );
  }

  // Get status info
  const getStatusIcon = () => {
    if (!latestOrder) return Package;
    
    switch (latestOrder.status) {
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return MapPin;
      case ORDER_STATUS.SHIPPED:
        return Truck;
      case ORDER_STATUS.PROCESSING:
        return Package;
      default:
        return Clock;
    }
  };

  const getStatusText = () => {
    if (count === 1 && latestOrder) {
      switch (latestOrder.status) {
        case ORDER_STATUS.OUT_FOR_DELIVERY:
          return 'Out for delivery';
        case ORDER_STATUS.SHIPPED:
          return 'Order shipped';
        case ORDER_STATUS.PROCESSING:
          return 'Being processed';
        default:
          return 'Order placed';
      }
    }
    return `${count} orders pending`;
  };

  const getStatusColor = () => {
    if (ordersByStatus[ORDER_STATUS.OUT_FOR_DELIVERY] > 0) return colors.error;
    if (ordersByStatus[ORDER_STATUS.SHIPPED] > 0) return colors.warning;
    if (ordersByStatus[ORDER_STATUS.PROCESSING] > 0) return colors.primary;
    return colors.textSecondary;
  };

  const StatusIcon = getStatusIcon();
  const statusText = getStatusText();
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
            {/* Status Icon */}
            <View className="w-12 h-12 rounded-xl items-center justify-center" style={{
              backgroundColor: statusColor + '20',
            }}>
              <Icon as={StatusIcon} size="lg" style={{ color: statusColor }} />
            </View>

            {/* Order Info */}
            <VStack className="flex-1">
              <Heading size="sm" className="mb-1 font-semibold" style={{ color: colors.text }}>
                Track Your Orders
              </Heading>
              <Text className="text-sm mb-1 font-medium" style={{ color: statusColor }}>
                {statusText}
              </Text>
              {latestOrder && (
                <Text className="text-xs" style={{ color: colors.textTertiary }}>
                  Order #{latestOrder.id} • {new Date(latestOrder.createdOn).toLocaleDateString()}
                </Text>
              )}
            </VStack>

            {/* Status Badge */}
            {count > 1 && (
              <View className="px-2 py-1 rounded-full min-w-6 items-center" style={{
                backgroundColor: statusColor,
              }}>
                <Text className="text-xs font-bold" style={{ color: colors.textInverse }}>
                  {count}
                </Text>
              </View>
            )}
          </HStack>

          {/* Arrow Icon */}
          <Icon as={ChevronRight} size="lg" className="ml-2" style={{ color: statusColor }} />
        </HStack>

        {/* Enhanced Status Breakdown with Icons and Colors */}
        {count > 1 && (
          <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
            <HStack className="justify-between">
              {Object.entries(ordersByStatus).slice(0, 4).map(([status, statusCount]) => {
                // Get icon and color for each status
                const getStatusIconAndColor = (orderStatus: string) => {
                  switch (orderStatus) {
                    case ORDER_STATUS.NEW:
                      return { icon: Clock, color: colors.warning };
                    case ORDER_STATUS.CONFIRMED:
                      return { icon: CheckCircle2, color: colors.success };
                    case ORDER_STATUS.PROCESSING:
                      return { icon: Package, color: colors.primary };
                    case ORDER_STATUS.SHIPPED:
                      return { icon: Truck, color: colors.info || colors.primary };
                    case ORDER_STATUS.OUT_FOR_DELIVERY:
                      return { icon: MapPin, color: colors.error };
                    default:
                      return { icon: AlertCircle, color: colors.textSecondary };
                  }
                };

                const { icon: StatusIcon, color: statusColor } = getStatusIconAndColor(status);

                return (
                  <VStack key={status} className="items-center flex-1" space="xs">
                    {/* Small Status Icon with Theme Color */}
                    <View className="w-6 h-6 rounded-lg items-center justify-center" style={{
                      backgroundColor: statusColor + '20',
                    }}>
                      <Icon as={StatusIcon} size="xs" style={{ color: statusColor }} />
                    </View>
                    
                    {/* Status Count */}
                    <Text className="text-xs font-bold" style={{ color: statusColor }}>
                      {statusCount}
                    </Text>
                    
                    {/* Status Label */}
                    <Text className="text-xs text-center leading-tight" style={{ 
                      color: colors.textTertiary,
                      maxWidth: 50
                    }}>
                      {status.toLowerCase().replace('_', ' ')}
                    </Text>
                  </VStack>
                );
              })}
            </HStack>
          </View>
        )}

        {/* Footer with Loading Text */}
        <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border + '50' }}>
          <HStack className="items-center justify-center" space="sm">
            {isNavigating ? (
              <>
                <ActivityIndicator size="small" color={statusColor} />
                <Text className="text-xs font-medium" style={{ color: statusColor }}>
                  Opening orders...
                </Text>
              </>
            ) : (
              <>
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                <Text className="text-xs" style={{ color: colors.textTertiary }}>
                  Tap to view all pending orders
                </Text>
              </>
            )}
          </HStack>
        </View>
      </Pressable>
    </View>
  );
}