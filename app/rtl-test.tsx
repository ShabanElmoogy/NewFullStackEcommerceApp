import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTLDemo } from '@/components/RTLDemo';

export default function RTLTestScreen() {
  return (
    <SafeAreaView className="flex-1">
      <RTLDemo />
    </SafeAreaView>
  );
}