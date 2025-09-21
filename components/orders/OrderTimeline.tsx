import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { 
  ORDER_STATUS_COLORS, 
  ORDER_TIMELINE_STEPS,
  getStatusIndex, 
  isStatusCompleted,
  getTranslatedTimelineSteps,
  getTranslatedStatusName,
  OrderStatus 
} from '@/constants/orderStatus';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  createdDate?: string;
  updatedDate?: string;
  className?: string;
}

const iconMap = {
  'shopping-cart': ShoppingCart,
  'check-circle': CheckCircle,
  'package': Package,
  'truck': Truck,
  'map-pin': MapPin,
  'check-circle-2': CheckCircle2,
};

export function OrderTimeline({ 
  currentStatus, 
  createdDate, 
  updatedDate, 
  className = '' 
}: OrderTimelineProps) {
  const { t } = useTranslation();
  const currentIndex = getStatusIndex(currentStatus);
  const translatedTimelineSteps = getTranslatedTimelineSteps(t);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className={`bg-white rounded-lg p-4 ${className}`}>
      <Text className="text-lg font-semibold text-gray-900 mb-4">
        {t('orders.orderTimeline', 'Order Timeline')}
      </Text>
      
      <VStack className="space-y-4">
        {translatedTimelineSteps.map((step, index) => {
          const isCompleted = isStatusCompleted(currentStatus, step.status);
          const isCurrent = step.status === currentStatus;
          const isPending = index > currentIndex;
          
          const IconComponent = iconMap[step.icon as keyof typeof iconMap] || Clock;
          const statusColor = ORDER_STATUS_COLORS[step.status];
          
          return (
            <View key={step.status} className="relative">
              <HStack className="items-start space-x-3">
                {/* Timeline Line */}
                {index < ORDER_TIMELINE_STEPS.length - 1 && (
                  <View 
                    className="absolute left-5 top-10 w-0.5 h-12"
                    style={{ 
                      backgroundColor: isCompleted ? statusColor : '#E5E7EB' 
                    }}
                  />
                )}
                
                {/* Status Icon */}
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center z-10"
                  style={{ 
                    backgroundColor: isCompleted ? statusColor : isPending ? '#F3F4F6' : '#E5E7EB' 
                  }}
                >
                  <Icon
                    as={IconComponent}
                    size="sm"
                    className={isCompleted ? 'text-white' : 'text-gray-400'}
                  />
                </View>
                
                {/* Status Content */}
                <VStack className="flex-1 pb-2">
                  <HStack className="items-center justify-between">
                    <Text 
                      className={`font-medium ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </Text>
                    
                    {isCurrent && (
                      <View className="bg-blue-100 px-2 py-1 rounded-full">
                        <Text className="text-xs font-medium text-blue-800">
                          {t('orders.current', 'Current')}
                        </Text>
                      </View>
                    )}
                  </HStack>
                  
                  <Text 
                    className={`text-sm ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </Text>
                  
                  {/* Show timestamp for completed or current status */}
                  {(isCompleted || isCurrent) && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {step.status === 'New' && createdDate 
                        ? formatDate(createdDate)
                        : isCurrent && updatedDate 
                        ? formatDate(updatedDate)
                        : isCompleted 
                        ? t('orders.completed', 'Completed')
                        : ''
                      }
                    </Text>
                  )}
                </VStack>
              </HStack>
            </View>
          );
        })}
      </VStack>
      
      {/* Order Status Summary */}
      <View className="mt-6 p-3 bg-gray-50 rounded-lg">
        <HStack className="items-center justify-between">
          <VStack>
            <Text className="text-sm text-gray-600">{t('orders.currentStatus', 'Current Status')}</Text>
            <Text 
              className="font-semibold"
              style={{ color: ORDER_STATUS_COLORS[currentStatus] }}
            >
              {getTranslatedStatusName(t, currentStatus)}
            </Text>
          </VStack>
          
          {updatedDate && (
            <VStack className="items-end">
              <Text className="text-sm text-gray-600">{t('orders.lastUpdated', 'Last Updated')}</Text>
              <Text className="text-sm font-medium text-gray-900">
                {formatDate(updatedDate)}
              </Text>
            </VStack>
          )}
        </HStack>
      </View>
    </View>
  );
}
