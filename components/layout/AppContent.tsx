import React from 'react';
import { AppContainer } from './AppContainer';
import { AppStack } from '../navigation/AppStack';
import { useNavigationBarSetup } from '@/hooks/useNavigationBarSetup';

export function AppContent() {
  // Handle navigation bar setup based on theme changes
  useNavigationBarSetup();

  return (
    <AppContainer>
      <AppStack />
    </AppContainer>
  );
}