import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AppLoader from '@/components/AppLoader';
import { useTheme } from '@/hooks/useTheme';

export default function ProductsLoadingState() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
      <AppLoader
        message={t('products.loading.title')}
        subtitle={t('products.loading.subtitle')}
      />
    </View>
  );
}