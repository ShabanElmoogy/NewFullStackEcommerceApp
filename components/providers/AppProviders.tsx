import React from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from '@/hooks/useTheme';
import { RTLWrapper } from '@/components/layout';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RTLWrapper>
          {children}
        </RTLWrapper>
      </ThemeProvider>
    </QueryProvider>
  );
}