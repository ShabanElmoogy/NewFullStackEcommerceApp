import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { ORDER_STATUS } from '@/constants/orderStatus';

interface OrderTrackingContentProps {
  count: number;
  latestOrder: any;
  statusColor: string;
}

export function OrderTrackingContent({ count, latestOrder, statusColor }: OrderTrackingContentProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const getStatusText = () => {
    if (count === 1 && latestOrder) {
      switch (latestOrder.status) {
        case ORDER_STATUS.OUT_FOR_DELIVERY:
          return t('orders.outForDelivery');
        case ORDER_STATUS.SHIPPED:
          return t('orders.orderShipped');
        case ORDER_STATUS.PROCESSING:
          return t('orders.beingProcessed');
        default:
          return t('orders.orderPlaced');
      }
    }
    return `${count} ${t('orders.ordersPending')}`;
  };

  const statusText = getStatusText();

  return (
    <VStack className="flex-1">
      <Heading size="sm" className="mb-1 font-semibold" style={{ color: colors.text }}>
        {t('orders.trackYourOrders')}
      </Heading>
      <Text className="text-sm mb-1 font-medium" style={{ color: statusColor }}>
        {statusText}
      </Text>
      {latestOrder && (
        <Text className="text-xs" style={{ color: colors.textTertiary }}>
          {t('orders.orderNumber')}{latestOrder.id} • {new Date(latestOrder.createdOn).toLocaleDateString()}
        </Text>
      )}
    </VStack>
  );
}