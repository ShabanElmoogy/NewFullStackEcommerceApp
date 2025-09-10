import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { 
  ShoppingCart, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react-native';
import { ORDER_STATUS, ORDER_STATUS_COLORS, OrderStatus } from '@/constants/orderStatus';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusIcons = {
  [ORDER_STATUS.NEW]: ShoppingCart,
  [ORDER_STATUS.CONFIRMED]: CheckCircle,
  [ORDER_STATUS.PROCESSING]: Package,
  [ORDER_STATUS.SHIPPED]: Truck,
  [ORDER_STATUS.OUT_FOR_DELIVERY]: MapPin,
  [ORDER_STATUS.DELIVERED]: CheckCircle2,
  [ORDER_STATUS.CANCELLED]: XCircle,
  [ORDER_STATUS.RETURNED]: RotateCcw,
};

const sizeStyles = {
  sm: {
    container: 'px-2 py-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-4 py-2',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
};

export function OrderStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className = '' 
}: OrderStatusBadgeProps) {
  const IconComponent = statusIcons[status];
  const statusColor = ORDER_STATUS_COLORS[status];
  const styles = sizeStyles[size];

  // Convert hex color to RGB for background opacity
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgb = hexToRgb(statusColor);
  const backgroundColor = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : '#F3F4F6';

  return (
    <View 
      className={`rounded-full ${styles.container} ${className}`}
      style={{ backgroundColor }}
    >
      <HStack className="items-center space-x-1">
        {showIcon && IconComponent && (
          <Icon
            as={IconComponent}
            size="xs"
            style={{ color: statusColor }}
          />
        )}
        <Text 
          className={`font-medium ${styles.text}`}
          style={{ color: statusColor }}
        >
          {status}
        </Text>
      </HStack>
    </View>
  );
}