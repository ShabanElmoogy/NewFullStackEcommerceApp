import React from 'react';
import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Package, Truck, Clock, MapPin } from 'lucide-react-native';
import { ORDER_STATUS } from '@/constants/orderStatus';

interface OrderTrackingHeaderProps {
  statusColor: string;
  latestOrder: any;
}

export function OrderTrackingHeader({ statusColor, latestOrder }: OrderTrackingHeaderProps) {
  // Get status icon
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

  const StatusIcon = getStatusIcon();

  return (
    <View className="w-12 h-12 rounded-xl items-center justify-center" style={{
      backgroundColor: statusColor + '20',
    }}>
      <Icon as={StatusIcon} size="lg" style={{ color: statusColor }} />
    </View>
  );
}