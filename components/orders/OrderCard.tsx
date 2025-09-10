import React from 'react';
import { View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Package, Calendar, Eye } from 'lucide-react-native';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Order } from '@/api/orders';
import { OrderStatus } from '@/constants/orderStatus';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
  showTrackButton?: boolean;
  className?: string;
}

export function OrderCard({ 
  order, 
  onPress, 
  showTrackButton = true, 
  className = '' 
}: OrderCardProps) {
  const router = useRouter();

  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleTrackOrder = () => {
    router.push(`/orders/track/${order.id}`);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      handleTrackOrder();
    }
  };

  return (
    <Pressable onPress={handleCardPress}>
      <View className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
        {/* Header */}
        <HStack className="items-center justify-between mb-3">
          <HStack className="items-center space-x-2">
            <Icon as={Package} size="sm" className="text-blue-600" />
            <Text className="font-semibold text-gray-900">
              Order #{order.id}
            </Text>
          </HStack>
          <OrderStatusBadge status={order.status as OrderStatus} size="sm" />
        </HStack>

        {/* Order Details */}
        <VStack className="space-y-2 mb-4">
          <HStack className="items-center justify-between">
            <HStack className="items-center space-x-1">
              <Icon as={Calendar} size="xs" className="text-gray-500" />
              <Text className="text-sm text-gray-600">
                {formatDate(order.createdOn)}
              </Text>
            </HStack>
            <Text className="font-semibold text-green-600">
              ${calculateTotal().toFixed(2)}
            </Text>
          </HStack>

          <Text className="text-sm text-gray-600">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Text>

          {/* Show first few items */}
          {order.items.slice(0, 2).map((item) => (
            <Text key={item.id} className="text-sm text-gray-500">
              • {item.productName} (x{item.quantity})
            </Text>
          ))}
          
          {order.items.length > 2 && (
            <Text className="text-sm text-gray-500">
              • +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
            </Text>
          )}
        </VStack>

        {/* Actions */}
        {showTrackButton && (
          <HStack className="justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onPress={handleTrackOrder}
            >
              <Icon as={Eye} size="xs" className="text-blue-600 mr-1" />
              <ButtonText className="text-blue-600">Track Order</ButtonText>
            </Button>
          </HStack>
        )}
      </View>
    </Pressable>
  );
}