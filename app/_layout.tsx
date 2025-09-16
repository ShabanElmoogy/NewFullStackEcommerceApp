import '@/global.css';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTLWrapper } from '@/components/layout';
import { Stack } from 'expo-router';
import GlobalHeader from '@/components/layout/GlobalHeader';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import * as NavigationBar from 'expo-navigation-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import ToastManager, { Toast } from 'toastify-react-native'
import { toastConfig } from './toastConfig'


const queryClient = new QueryClient();

// -------------------
// Inner component
// -------------------
function AppContent() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const setupNavigationBar = async () => {
        try {
          await NavigationBar.setBackgroundColorAsync(colors.background);
          // ✅ Dark → أزرار فاتحة (أبيض), Light → أزرار غامقة (أسود)
          await NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
        } catch (error) {
          console.log('Navigation bar setup error:', error);
        }
      };

      setupNavigationBar();
    }
  }, [colors.background, isDark]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
      <GluestackUIProvider mode={isDark ? 'dark' : 'light'}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GlobalHeader />
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
        <ToastManager config={toastConfig} />
      </GluestackUIProvider>
    </SafeAreaView>
  );
}

// -------------------
// Root Layout
// -------------------
export default function RootLayout() {
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === 'android') {
      const initializeNavigationBar = async () => {
        try {
          const savedTheme = await AsyncStorage.getItem('@theme_preference');
          const themePreference = savedTheme || 'system';

          const actualTheme =
            themePreference === 'system'
              ? (systemColorScheme ?? 'light')
              : themePreference;

          const isDarkMode = actualTheme === 'dark';
          const colors = Colors[actualTheme];

          await NavigationBar.setBackgroundColorAsync(colors.background);
          await NavigationBar.setButtonStyleAsync(isDarkMode ? 'light' : 'dark');
        } catch (error) {
          console.log('Failed to initialize navigation bar:', error);
        }
      };

      initializeNavigationBar();
    }
  }, [systemColorScheme]);

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
