import React from 'react';
import { View, Button } from 'react-native';
import { useLanguageStore } from '@/store/languageStore';
import { Text } from '@/components/ui/text';
import i18n from '@/utils/i18n';

const LanguageToggleExample = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{i18n.t('welcome')}</Text>
      <Button title="Toggle Language" onPress={toggleLanguage} />
      <Text>Current Language: {language}</Text>
    </View>
  );
};

export default LanguageToggleExample;