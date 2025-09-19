import React from 'react';
import { VStack } from './ui/vstack';
import { HStack } from './ui/hstack';
import { Text } from './ui/text';
import { Button, ButtonText } from './ui/button';
import { Card } from './ui/card';
import { Icon } from './ui/icon';
import { AlertCircle, X } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface ConfirmationToastProps {
  id: string;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmationToast({
  id,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: ConfirmationToastProps) {
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          border: 'border-error-500',
          icon: 'text-error-500',
          confirmBg: 'bg-error-500',
          confirmText: 'text-white'
        };
      case 'warning':
        return {
          border: 'border-warning-500',
          icon: 'text-warning-500',
          confirmBg: 'bg-warning-500',
          confirmText: 'text-white'
        };
      default:
        return {
          border: 'border-primary-500',
          icon: 'text-primary-500',
          confirmBg: 'bg-primary-500',
          confirmText: 'text-white'
        };
    }
  };

  const colors = getColors();

  return (
    <Card className={`p-4 mx-4 my-2 bg-background-0 border-2 ${colors.border} shadow-lg`}>
      <VStack space="md">
        {/* Header */}
        <HStack className="justify-between items-start">
          <HStack space="sm" className="flex-1 items-start">
            <Icon as={AlertCircle} size="md" className={colors.icon} />
            <VStack className="flex-1" space="xs">
              <Text className="font-semibold text-typography-900 text-base">
                {title}
              </Text>
              <Text className="text-typography-600 text-sm leading-5">
                {message}
              </Text>
            </VStack>
          </HStack>
          <Pressable onPress={onCancel} className="p-1">
            <Icon as={X} size="sm" className="text-typography-400" />
          </Pressable>
        </HStack>

        {/* Action Buttons */}
        <HStack space="sm" className="justify-end">
          <Button
            variant="outline"
            size="sm"
            onPress={onCancel}
            className="border-typography-300"
          >
            <ButtonText className="text-typography-600">{cancelText}</ButtonText>
          </Button>
          <Button
            size="sm"
            onPress={onConfirm}
            className={colors.confirmBg}
          >
            <ButtonText className={colors.confirmText}>{confirmText}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
}
