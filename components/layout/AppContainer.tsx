import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '@/hooks/useTheme';
import { AppStatusBar } from './AppStatusBar';
import GlobalHeader from './GlobalHeader';
import ToastManager from 'toastify-react-native';
import { toastConfig } from '@/app/toastConfig';

interface AppContainerProps {
  children: React.ReactNode;
}

export function AppContainer({ children }: AppContainerProps) {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top']}
    >
      <AppStatusBar />
      <GluestackUIProvider mode={isDark ? 'dark' : 'light'}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GlobalHeader />
          {children}
        </GestureHandlerRootView>
        <ToastManager config={toastConfig} />
      </GluestackUIProvider>
    </SafeAreaView>
  );
}