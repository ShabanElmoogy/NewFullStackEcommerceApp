import React from 'react';
import { Pressable } from 'react-native';
import { Moon, Sun, Monitor } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useSettings, ThemeMode } from '@/store/settingsStore';

export function ThemeToggle() {
  const { themeMode, setThemeMode } = useSettings();

  const handleToggle = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getIcon = () => {
    switch (themeMode) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
      default: return Sun;
    }
  };

  const getLabel = () => {
    switch (themeMode) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'system': return 'System Mode';
      default: return 'Light Mode';
    }
  };

  const Icon = getIcon();

  return (
    <Pressable
      onPress={handleToggle}
      className="bg-primary-600 px-4 py-3 rounded-xl"
    >
      <HStack className="items-center">
        <Icon className="text-white mr-3" size={20} />
        <Text className="text-white font-bold">
          {getLabel()}
        </Text>
      </HStack>
    </Pressable>
  );
}
