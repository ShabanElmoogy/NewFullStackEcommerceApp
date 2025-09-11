import React from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Scale } from 'lucide-react-native';

// Example component showing different ways to navigate to compare screen
export default function CompareNavigationExample() {
  
  // Method 1: Using router.push
  const openCompareScreen = () => {
    router.push('/compare');
  };

  // Method 2: Using router.navigate (replaces current screen)
  const navigateToCompare = () => {
    router.navigate('/compare');
  };

  return (
    <>
      {/* Button Example */}
      <Button onPress={openCompareScreen} className="bg-blue-500">
        <Icon as={Scale} size="sm" className="text-white mr-2" />
        <ButtonText className="text-white">Compare Products</ButtonText>
      </Button>

      {/* Pressable Example */}
      <Pressable onPress={openCompareScreen}>
        {/* Your custom UI */}
      </Pressable>
    </>
  );
}