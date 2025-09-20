import React from 'react';
import { View, Pressable } from 'react-native';
import { Globe } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useTheme } from '@/hooks/useTheme';

export default function LanguageToggle() {
  const { colors } = useTheme();
  const { toggleLanguage } = useLanguageStore();

  return (
    <Pressable onPress={toggleLanguage} className="active:opacity-90">
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{ backgroundColor: (colors.success || '#10B981') + '20' }}
      >
        <Globe size={20} color={colors.success || '#10B981'} />
      </View>
    </Pressable>
  );
}