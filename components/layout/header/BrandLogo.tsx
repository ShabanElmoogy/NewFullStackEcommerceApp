import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/useTheme';

export default function BrandLogo() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  const handleHomePress = useCallback(() => {
    const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
    
    // Only navigate if not already on home to prevent unnecessary navigation
    if (!isHome) {
      router.replace('/');
    }
  }, [pathname]);

  return (
    <Pressable onPress={handleHomePress} className="active:opacity-70 p-2">
      <View className="flex-row items-center gap-2">
        <ShoppingBag size={24} color={colors.primary} />
        <Text className="text-xl font-extrabold" style={{ color: colors.text }}>
          {t('common.shop')}
        </Text>
      </View>
    </Pressable>
  );
}