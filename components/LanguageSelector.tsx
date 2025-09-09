import React, { useState } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { 
  Modal, 
  ModalBackdrop, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody 
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Check, Globe, X } from 'lucide-react-native';
import { useLocalization } from '@/hooks/useLocalization';
import { useRTLStyles } from '@/hooks/useRTLStyles';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose }) => {
  const { currentLocale, changeLanguage, getSupportedLocales, t } = useLocalization();
  const { isRTL, flexRow, textLeft } = useRTLStyles();
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const supportedLocales = getSupportedLocales();

  const handleLanguageChange = (localeCode: string) => {
    setSelectedLocale(localeCode);
  };

  const handleConfirm = () => {
    if (selectedLocale !== currentLocale) {
      Alert.alert(
        t('settings.languageSelection'),
        'Changing language will restart the app to apply changes properly.',
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('common.confirm'),
            onPress: () => {
              changeLanguage(selectedLocale);
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="max-w-md">
        <ModalHeader>
          <HStack className={`items-center justify-between ${flexRow}`}>
            <HStack className="items-center">
              <Icon as={Globe} size="sm" className="text-primary-600 mr-2" />
              <Text className="text-lg font-bold">{t('settings.languageSelection')}</Text>
            </HStack>
            <ModalCloseButton>
              <Icon as={X} size="sm" />
            </ModalCloseButton>
          </HStack>
        </ModalHeader>
        
        <ModalBody>
          <VStack space="sm" className="mb-4">
            {supportedLocales.map((locale) => (
              <Pressable
                key={locale.code}
                onPress={() => handleLanguageChange(locale.code)}
                className={`p-3 rounded-lg border ${
                  selectedLocale === locale.code
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-outline-200 bg-background-0'
                }`}
              >
                <HStack className={`items-center justify-between ${flexRow}`}>
                  <VStack>
                    <Text 
                      className={`font-semibold ${textLeft} ${
                        selectedLocale === locale.code ? 'text-primary-700' : 'text-typography-900'
                      }`}
                    >
                      {locale.nativeName}
                    </Text>
                    <Text 
                      className={`text-sm ${textLeft} ${
                        selectedLocale === locale.code ? 'text-primary-600' : 'text-typography-600'
                      }`}
                    >
                      {locale.name} {locale.isRTL ? '(RTL)' : '(LTR)'}
                    </Text>
                  </VStack>
                  {selectedLocale === locale.code && (
                    <Icon as={Check} size="sm" className="text-primary-600" />
                  )}
                </HStack>
              </Pressable>
            ))}
          </VStack>
          
          <HStack className={`gap-3 ${flexRow}`}>
            <Button variant="outline" onPress={onClose} className="flex-1">
              <ButtonText>{t('common.cancel')}</ButtonText>
            </Button>
            <Button onPress={handleConfirm} className="flex-1">
              <ButtonText>{t('common.confirm')}</ButtonText>
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};