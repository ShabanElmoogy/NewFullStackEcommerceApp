import React from 'react';
import { View, Pressable } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Package, Truck, Clock, ChevronRight } from 'lucide-react-native';
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
  const { 
    count, 
    latestOrder, 
    ordersByStatus, 
    hasNonReceivedOrders, 
    isLoading 
  } = useNonReceivedOrders();

  const handlePress = () => {
    const route = '/orders?filter=non-received';
    if (onNavigate) {
      onNavigate(route);
    } else {
      router.push(route as any);
    }
  };

  // Don't render if no non-received orders and not loading
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
                <View className="h-4 w-32 rounded bg-gray-200 mb-2" />
                <View className="h-3 w-24 rounded bg-gray-200" />
              </VStack>
            </HStack>
            <Icon as={ChevronRight} size="lg" style={{ color: colors.textTertiary }} />
          </HStack>
        </View>
      </View>
    );
  }

  // Get the appropriate icon based on latest order status
  const getStatusIcon = () => {
    if (!latestOrder) return Package;
    
    switch (latestOrder.status) {
      case ORDER_STATUS.SHIPPED:
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return Truck;
      case ORDER_STATUS.PROCESSING:
        return Package;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon();

  // Get status display text
  const getStatusText = () => {
    if (count === 1 && latestOrder) {
      return `Order ${latestOrder.status.toLowerCase()}`;
    }
    return `${count} orders pending`;
  };

  // Get the most urgent status for color
  const getUrgentStatus = () => {
    if (ordersByStatus[ORDER_STATUS.OUT_FOR_DELIVERY] > 0) return 'delivery';
    if (ordersByStatus[ORDER_STATUS.SHIPPED] > 0) return 'shipped';
    if (ordersByStatus[ORDER_STATUS.PROCESSING] > 0) return 'processing';
    return 'pending';
  };

  const urgentStatus = getUrgentStatus();
  
  // Status-based colors
  const getStatusColor = () => {
    switch (urgentStatus) {
      case 'delivery':
        return colors.error; // Red for urgent delivery
      case 'shipped':
        return colors.warning; // Orange for shipped
      case 'processing':
        return colors.primary; // Blue for processing
      default:
        return colors.textSecondary; // Gray for pending
    }
  };

  const statusColor = getStatusColor();

  return (
    <View className="mx-4 mb-6">
      <Pressable
        onPress={handlePress}
        className="rounded-2xl p-4 border shadow-sm active:opacity-80"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
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
              <Heading size="sm" className="mb-1" style={{ color: colors.text }}>
                Track Your Orders
              </Heading>
              <Text className="text-sm mb-1" style={{ color: statusColor }}>
                {getStatusText()}
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
          <Icon as={ChevronRight} size="lg" className="ml-2" style={{ color: colors.textTertiary }} />
        </HStack>

        {/* Status Breakdown for multiple orders */}
        {count > 1 && (
          <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
            <HStack className="justify-between">
              {Object.entries(ordersByStatus).map(([status, statusCount]) => (
                <VStack key={status} className="items-center">
                  <Text className="text-xs font-medium" style={{ color: colors.text }}>
                    {statusCount}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textTertiary }}>
                    {status.toLowerCase().replace('_', ' ')}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </View>
        )}
      </Pressable>
    </View>
  );
}