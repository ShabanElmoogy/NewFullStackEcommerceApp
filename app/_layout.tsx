import '@/global.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTLWrapper, DrawerNavigator } from '@/components/layout';

const queryClient = new QueryClient();

// -------------------
// Root Layout
// -------------------
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RTLWrapper>
        <SafeAreaView className="flex-1 bg-background-0" edges={['right', 'bottom']}>
          <GluestackUIProvider mode="light">
            <GestureHandlerRootView style={{ flex: 1 }}>
              <DrawerNavigator />
            </GestureHandlerRootView>
          </GluestackUIProvider>
        </SafeAreaView>
      </RTLWrapper>
    </QueryClientProvider>
  );
}