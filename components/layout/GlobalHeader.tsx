import React from 'react';
import { View } from 'react-native';
import { usePathname } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { useTheme } from '@/hooks/useTheme';
import { BrandLogo, HeaderActions } from './header';

export default function GlobalHeader() {
  const pathname = usePathname();
  const { colors } = useTheme();

  const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';

  return (
    <View
      className="mt-3"
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderColor: colors.border,
        paddingBottom: isHome ? 10 : 0,
      }}
    >
      {/* Top Bar */}
      <HStack className="items-center justify-between px-4 py-3">
        {/* Left: Brand */}
        <BrandLogo />

        {/* Right: Actions */}
        <HeaderActions />
      </HStack>
    </View>
  );
}
