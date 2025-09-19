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
import { useLanguageStore } from '@/store/languageStore';
import i18n from '@/utils/i18n';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const supportedLocales = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onClose }) => {
  const { language, handleLanguageChange } = useLanguageStore();
  const [selectedLocale, setSelectedLocale] = useState(language);

  const handleLanguageChangeLocal = (localeCode: string) => {
    setSelectedLocale(localeCode);
  };

  const handleConfirm = () => {
    if (selectedLocale !== language) {
      Alert.alert(
        'Language Selection',
        'Changing language will restart the app to apply changes properly.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Confirm',
            onPress: () => {
              handleLanguageChange(selectedLocale);
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
          <HStack className="items-center justify-between">
            <HStack className="items-center">
              <Icon as={Globe} size="sm" className="text-primary-600 mr-2" />
              <Text className="text-lg font-bold">Language Selection</Text>
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
                onPress={() => handleLanguageChangeLocal(locale.code)}
                className={`p-3 rounded-lg border ${
                  selectedLocale === locale.code
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-outline-200 bg-background-0'
                }`}
              >
                <HStack className="items-center justify-between">
                  <VStack>
                    <Text 
                      className={`font-semibold text-left ${
                        selectedLocale === locale.code ? 'text-primary-700' : 'text-typography-900'
                      }`}
                    >
                      {locale.nativeName}
                    </Text>
                    <Text 
                      className={`text-sm text-left ${
                        selectedLocale === locale.code ? 'text-primary-600' : 'text-typography-600'
                      }`}
                    >
                      {locale.name}
                    </Text>
                  </VStack>
                  {selectedLocale === locale.code && (
                    <Icon as={Check} size="sm" className="text-primary-600" />
                  )}
                </HStack>
              </Pressable>
            ))}
          </VStack>
          
          <HStack className="gap-3">
            <Button variant="outline" onPress={onClose} className="flex-1">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button onPress={handleConfirm} className="flex-1">
              <ButtonText>Confirm</ButtonText>
            </Button>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
