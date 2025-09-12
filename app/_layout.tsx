import '@/global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTLWrapper } from '@/components/layout';
import { Stack } from 'expo-router';
import GlobalHeader from '@/components/layout/GlobalHeader';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';

const queryClient = new QueryClient();

// Inner component that uses theme
function AppContent() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <GluestackUIProvider mode={isDark ? 'dark' : 'light'}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* Global fixed header */}
          <GlobalHeader />

          {/* App navigator stack without individual headers */}
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
  );
}

// -------------------
// Root Layout
// -------------------
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RTLWrapper>
          <AppContent />
        </RTLWrapper>
      </ThemeProvider>
    </QueryClientProvider>
  );
}