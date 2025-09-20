import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface OrderTrackingFooterProps {
  isNavigating: boolean;
  statusColor: string;
}

export function OrderTrackingFooter({ isNavigating, statusColor }: OrderTrackingFooterProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="mt-3 pt-3 border-t" style={{ borderTopColor: colors.border + '50' }}>
      <HStack className="items-center justify-center" space="sm">
        {isNavigating ? (
          <>
            <ActivityIndicator size="small" color={statusColor} />
            <Text className="text-xs font-medium" style={{ color: statusColor }}>
              {t('orders.openingOrders')}
            </Text>
          </>
        ) : (
          <>
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
            <Text className="text-xs" style={{ color: colors.textTertiary }}>
              {t('orders.tapToViewAllPendingOrders')}
            </Text>
          </>
        )}
      </HStack>
    </View>
  );
}