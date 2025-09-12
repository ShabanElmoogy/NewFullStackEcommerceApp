import React from 'react';
import { View, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Globe, Heart, ShoppingCart } from 'lucide-react-native';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';

export default function GlobalHeader() {
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());
  const { isRTL, language, toggleLanguage } = useLanguageStore();
  const pathname = usePathname();

  const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';

  return (
    <View
      className="bg-background-0 border-b border-outline-100 mt-3"
      style={{
        paddingBottom: isHome ? 10 : 0,
      }}
    >
      {/* Top Bar */}
      <HStack className="items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <Pressable onPress={() => router.push('/')} className="active:opacity-70">
          <Text className="text-typography-900 text-xl font-extrabold">Shop</Text>
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
                backgroundColor: '#ECFDF5', // green tint
              }}
            >
              <Globe size={20} color="#10B981" />
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
                backgroundColor: '#FEF2F2', // red tint
                position: 'relative',
              }}
            >
              <Heart size={20} color="#EF4444" />
              {wishlistCount > 0 && (
                <View
                  className="absolute bg-error-500 rounded-lg px-1 min-w-4 items-center -top-1"
                  style={{ right: isRTL ? undefined : -4, left: isRTL ? -4 : undefined }}
                >
                  <Text className="text-white text-2xs font-bold">{wishlistCount}</Text>
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
                backgroundColor: '#EFF6FF', // blue tint
                position: 'relative',
              }}
            >
              <ShoppingCart size={20} color="#3B82F6" />
              {cartCount > 0 && (
                <View
                  className="absolute bg-error-500 rounded-lg px-1 min-w-4 items-center -top-1"
                  style={{ right: isRTL ? undefined : -4, left: isRTL ? -4 : undefined }}
                >
                  <Text className="text-white text-2xs font-bold">{cartCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </HStack>
      </HStack>
    </View>
  );
}
