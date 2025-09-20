import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { useWishlist } from '@/store/wishlistStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';

export default function WishlistButton() {
  const { colors } = useTheme();
  const { isRTL } = useLanguageStore();
  const wishlistCount = useWishlist((state) => state.totalItems());

  const handleWishlistPress = useCallback(() => {
    router.push('/wishlist');
  }, []);

  return (
    <Pressable onPress={handleWishlistPress} className="active:opacity-90">
      <View
        className="w-11 h-11 rounded-full items-center justify-center relative"
        style={{ backgroundColor: (colors.error || '#EF4444') + '20' }}
      >
        <Heart size={20} color={colors.error || '#EF4444'} />
        {wishlistCount > 0 && (
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
              {wishlistCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}