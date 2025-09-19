import '@/global.css';
import React from 'react';
import { AppProviders } from '@/components/providers';
import { AppContent } from '@/components/layout/AppContent';
import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function RootLayout() {
  // Handle app initialization (API service setup, navigation bar, etc.)
  useAppInitialization();

  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
