import '@/global.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTLWrapper } from '@/components/layout';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

// -------------------
// Root Layout
// -------------------
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RTLWrapper>
        <SafeAreaView className="flex-1 bg-background-0" edges={['top']}>
          <GluestackUIProvider mode="light">
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="cart" options={{ headerShown: false }} />
                <Stack.Screen name="wishlist" options={{ headerShown: false }} />
                <Stack.Screen name="orders" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
                <Stack.Screen name="product" options={{ headerShown: false }} />
                <Stack.Screen name="order" options={{ headerShown: false }} />
                <Stack.Screen name="rtl-test" options={{ headerShown: false }} />
              </Stack>
            </GestureHandlerRootView>
          </GluestackUIProvider>
        </SafeAreaView>
      </RTLWrapper>
    </QueryClientProvider>
  );
}