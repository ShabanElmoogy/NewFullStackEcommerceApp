import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ShoppingCart } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useCart } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';

export default function CartButton() {
  const { colors } = useTheme();
  const { isRTL } = useLanguageStore();
  const cartCount = useCart((state) => state.totalQuantity());

  const handleCartPress = useCallback(() => {
    router.push('/cart');
  }, []);

  return (
    <Pressable onPress={handleCartPress} className="active:opacity-90">
      <View
        className="w-11 h-11 rounded-full items-center justify-center relative"
        style={{ backgroundColor: (colors.primary || '#3B82F6') + '20' }}
      >
        <ShoppingCart size={20} color={colors.primary || '#3B82F6'} />
        {cartCount > 0 && (
          <View
            className={`absolute -top-1.5 w-5 h-5 rounded-full items-center justify-center border ${
              isRTL ? '-left-1.5' : '-right-1.5'
            }`}
            style={{
              backgroundColor: colors.error || '#EF4444',
              borderColor: colors.surface,
            }}
          >
            <Text className="text-white text-xs font-bold">
              {cartCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}