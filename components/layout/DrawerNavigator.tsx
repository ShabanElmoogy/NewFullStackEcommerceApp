import React from 'react';
import { Platform } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from './CustomDrawerContent';
import { DrawerHeaderLeft, DrawerHeaderRight } from './DrawerHeaderComponents';
import { useLanguageStore } from '@/store/languageStore';

export function DrawerNavigator() {
  const { isRTL } = useLanguageStore();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerLeft: () => <DrawerHeaderLeft navigation={navigation} />,
        headerRight: () => <DrawerHeaderRight />,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        // 👇 دي بتتحكم في الجهة
        drawerPosition: isRTL ? 'right' : 'left',

        drawerStyle: {
          width: 390,
          maxWidth: 320,
          backgroundColor: 'rgb(var(--color-background-50))',
        },

        drawerType: Platform.OS === 'web' ? 'front' : 'front', // front أكثر استقرار في RTL
        overlayColor: Platform.OS === 'web' ? 'transparent' : 'rgba(0,0,0,0.5)',
        swipeEdgeWidth: Platform.OS === 'web' ? 0 : undefined,
        keyboardDismissMode: 'on-drag',
        sceneContainerStyle: {
          backgroundColor: 'rgb(var(--color-background-0))',
        },
      })}
    >
      <Drawer.Screen name="index" options={{ title: 'Home' }} />
      <Drawer.Screen name="products" options={{ title: 'Products' }} />
      <Drawer.Screen name="compare" options={{ title: 'Compare Products' }} />
      <Drawer.Screen name="orders" options={{ title: 'Orders' }} />
      <Drawer.Screen name="cart" options={{ title: 'Cart' }} />
      <Drawer.Screen name="wishlist" options={{ title: 'Wishlist' }} />
      <Drawer.Screen name="rtl-test" options={{ title: 'RTL Test' }} />
    </Drawer>

  );
}
