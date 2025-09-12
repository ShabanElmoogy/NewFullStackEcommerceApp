import React from 'react';
import { View, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Globe, Heart, ShoppingCart } from 'lucide-react-native';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';

export default function GlobalHeader() {
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());
  const { isRTL, language, toggleLanguage } = useLanguageStore();
  const pathname = usePathname();
  const { colors, isDark } = useTheme();

  const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';

  return (
    <View
      className="mt-3"
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderColor: colors.border,
        paddingBottom: isHome ? 10 : 0,
      }}
    >
      {/* Top Bar */}
      <HStack className="items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <Pressable onPress={() => router.push('/')} className="active:opacity-70">
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>Shop</Text>
        </Pressable>

        {/* Right: Actions with colored icon chips */}
        <HStack className="items-center" space="md">
          {/* Language */}
          <Pressable onPress={toggleLanguage} className="active:opacity-90">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (colors.success || '#10B981') + '20',
              }}
            >
              <Globe size={20} color={colors.success || '#10B981'} />
            </View>
          </Pressable>

          {/* Wishlist */}
          <Pressable onPress={() => router.push('/wishlist')} className="active:opacity-90">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (colors.error || '#EF4444') + '20',
                position: 'relative',
              }}
            >
              <Heart size={20} color={colors.error || '#EF4444'} />
              {wishlistCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: isRTL ? undefined : -6,
                    left: isRTL ? -6 : undefined,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.error || '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.surface,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>{wishlistCount}</Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* Cart */}
          <Pressable onPress={() => router.push('/cart')} className="active:opacity-90">
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (colors.primary || '#3B82F6') + '20',
                position: 'relative',
              }}
            >
              <ShoppingCart size={20} color={colors.primary || '#3B82F6'} />
              {cartCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: isRTL ? undefined : -6,
                    left: isRTL ? -6 : undefined,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.error || '#EF4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: colors.surface,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </HStack>
      </HStack>
    </View>
  );
}
