import React, { useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Menu, ShoppingCart, Heart, Globe } from 'lucide-react-native';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import { useLanguageStore } from '@/store/languageStore';

interface DrawerHeaderLeftProps {
  navigation: any;
}

export function DrawerHeaderLeft({ navigation }: DrawerHeaderLeftProps) {
  return (
    <Pressable
      onPress={() => navigation.openDrawer()}
      className="ms-4 p-2"
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <Menu className="text-content-primary" size={24} />
    </Pressable>
  );
}

export function DrawerHeaderRight() {
  const wishlistCount = useWishlist((state) => state.totalItems());
  const cartCount = useCart((state) => state.totalQuantity());
  const { isRTL, language, toggleLanguage } = useLanguageStore();

  return (
    <HStack className="mr-4 flex-row">
      <Pressable onPress={toggleLanguage} className="p-2">
        <HStack className="items-center">
          <Globe className="text-typography-700" size={22} />
          <Text className="text-typography-700 text-xs font-bold ms-1">
            {language?.toUpperCase()}
          </Text>
        </HStack>
      </Pressable>
      <Pressable onPress={() => router.push('/wishlist')} className="p-2">
        <View>
          <Heart className="text-typography-700" size={24} />
          {wishlistCount > 0 && (
            <View 
              className="absolute bg-error-500 rounded-lg px-1 min-w-4 items-center -top-1"
              style={{
                right: isRTL ? undefined : -4,
                left: isRTL ? -4 : undefined
              }}
            >
              <Text className="text-white text-xs font-bold">{wishlistCount}</Text>
            </View>
          )}
        </View>
      </Pressable>

      <Pressable onPress={() => router.push('/cart')} className="p-2">
        <View>
          <ShoppingCart className="text-typography-700" size={24} />
          {cartCount > 0 && (
            <View 
              className="absolute bg-error-500 rounded-lg px-1 min-w-4 items-center -top-1"
              style={{
                right: isRTL ? undefined : -4,
                left: isRTL ? -4 : undefined
              }}
            >
              <Text className="text-white text-xs font-bold">{cartCount}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </HStack>
  );
}
