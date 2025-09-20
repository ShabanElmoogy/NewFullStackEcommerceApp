import React from 'react';
import { View } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Package, Truck, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { 
  ORDER_STATUS_COLORS, 
  ORDER_STATUS_ICONS,
  ORDER_TIMELINE_STEPS,
  getTranslatedStatusName,
  type OrderStatus 
} from '@/constants/orderStatus';

interface OrderStatusBreakdownProps {
  ordersByStatus: Record<string, number>;
}

export function OrderStatusBreakdown({ ordersByStatus }: OrderStatusBreakdownProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Icon mapping for Lucide React Native icons
  const iconMap = {
    'shopping-cart': Clock,
    'check-circle': CheckCircle2,
    'package': Package,
    'truck': Truck,
    'map-pin': MapPin,
    'check-circle-2': CheckCircle2,
    'x-circle': AlertCircle,
    'rotate-ccw': AlertCircle,
  } as const;

  // Get icon and color for each status
  const getStatusIconAndColor = (orderStatus: string) => {
    const status = orderStatus as OrderStatus;
    const iconName = ORDER_STATUS_ICONS[status];
    const color = ORDER_STATUS_COLORS[status];
    
    if (iconName && color) {
      const IconComponent = iconMap[iconName] || AlertCircle;
      return { icon: IconComponent, color };
    }
    
    return { icon: AlertCircle, color: colors.textSecondary };
  };

  // Get statuses in timeline order that have counts > 0
  const getOrderedStatuses = () => {
    const orderedStatuses: Array<{ status: OrderStatus; count: number }> = [];
    
    // First, add timeline statuses in order
    ORDER_TIMELINE_STEPS.forEach(step => {
      const count = ordersByStatus[step.status] || 0;
      if (count > 0) {
        orderedStatuses.push({ status: step.status, count });
      }
    });
    
    // Then add any non-timeline statuses (cancelled, returned)
    Object.entries(ordersByStatus).forEach(([status, count]) => {
      const isTimelineStatus = ORDER_TIMELINE_STEPS.some(step => step.status === status);
      if (!isTimelineStatus && count > 0) {
        orderedStatuses.push({ status: status as OrderStatus, count });
      }
    });
    
    return orderedStatuses.slice(0, 5); // Limit to 5 items for UI
  };

  const orderedStatuses = getOrderedStatuses();

  return (
    <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
      <HStack className="justify-around">
        {orderedStatuses.map(({ status, count }) => {
          const { icon: StatusIcon, color: statusColor } = getStatusIconAndColor(status);

          return (
            <VStack key={status} className="items-center flex-1" space="xs">

              {/* Small Status Icon with Theme Color */}
              <View className="w-6 h-6 rounded-lg items-center justify-center" style={{
                backgroundColor: statusColor + '20',
              }}>
                <Icon as={StatusIcon} size="md" style={{ color: statusColor }} />
              </View>
              
              {/* Status Count */}
              <Text className="text-sm font-bold" style={{ color: statusColor }}>
                {count}
              </Text>
              
              {/* Status Label */}
              <Text className="text-xs text-center leading-tight" style={{ 
                color: colors.textTertiary,
                maxWidth: 50
              }}>
                {getTranslatedStatusName(t, status)}
              </Text>

            </VStack>
          );
        })}
      </HStack>
    </View>
  );
}