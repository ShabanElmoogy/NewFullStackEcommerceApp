import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Globe } from 'lucide-react-native';
import { useLanguageStore } from '@/store/languageStore';
import { useRTL } from '@/hooks/useRTL';
import i18n from '@/utils/i18n';

export const LanguageToggleButton: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();
  const { isRTL, getTextAlign, getFlexDirection } = useRTL();

  return (
    <Pressable
      onPress={toggleLanguage}
      className="bg-primary-50 border border-primary-200 rounded-lg p-3 mx-4 mb-2"
    >
      <View style={{ flexDirection: getFlexDirection('row') }} className="items-center">
        <Icon 
          as={Globe} 
          size="sm" 
          className={`text-primary-600 ${isRTL ? 'ms-2' : 'me-2'}`} 
        />
        <View className="flex-1">
          <Text 
            className="font-semibold text-primary-700"
            style={{ textAlign: getTextAlign('left') }}
          >
            {i18n.t('welcome') || 'Welcome'} - {language === 'en' ? 'العربية' : 'English'}
          </Text>
          <Text 
            className="text-sm text-primary-600 mt-1"
            style={{ textAlign: getTextAlign('left') }}
          >
            {isRTL ? 'اتجاه من اليمين إلى اليسار' : 'Left to Right Direction'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};