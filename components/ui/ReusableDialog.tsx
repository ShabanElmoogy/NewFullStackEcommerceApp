import React from 'react';
import { View } from 'react-native';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react-native';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
} from './alert-dialog';
import { Button, ButtonText } from './button';
import { Heading } from './heading';
import { Text } from './text';
import { Icon } from './icon';
import { HStack } from './hstack';
import { VStack } from './vstack';
import { useTheme } from '@/hooks/useTheme';

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

export interface ReusableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: DialogType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  
  // Confirmation dialog specific props
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  
  // Custom action buttons
  actions?: Array<{
    text: string;
    onPress: () => void;
    variant?: 'solid' | 'outline' | 'link';
    colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
    isLoading?: boolean;
  }>;
  
  // Styling
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
}

const getDialogIcon = (type: DialogType) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    case 'confirm':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
};

const getDialogColors = (type: DialogType, colors: any) => {
  switch (type) {
    case 'success':
      return {
        iconColor: colors.success,
        iconBgColor: colors.success + '15',
      };
    case 'warning':
      return {
        iconColor: colors.warning,
        iconBgColor: colors.warning + '15',
      };
    case 'error':
      return {
        iconColor: colors.error,
        iconBgColor: colors.error + '15',
      };
    case 'confirm':
      return {
        iconColor: colors.warning,
        iconBgColor: colors.warning + '15',
      };
    case 'info':
    default:
      return {
        iconColor: colors.info || colors.primary,
        iconBgColor: (colors.info || colors.primary) + '15',
      };
  }
};

export const ReusableDialog: React.FC<ReusableDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  size = 'md',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  actions,
  showCloseButton = true,
  closeOnBackdropPress = true,
}) => {
  const { colors, isDark } = useTheme();
  const IconComponent = getDialogIcon(type);
  const dialogColors = getDialogColors(type, colors);

  // Debug logging

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const renderDefaultActions = () => {
    if (type === 'confirm' && onConfirm) {
      return (
        <HStack space="sm" className="justify-end">
          <Button
            variant="outline"
            size="sm"
            onPress={onClose}
            style={{
              borderColor: colors.border,
              backgroundColor: 'transparent',
            }}
          >
            <ButtonText style={{ color: colors.textSecondary }}>
              {cancelText}
            </ButtonText>
          </Button>
          <Button
            variant="solid"
            size="sm"
            onPress={() => {
              onConfirm();
              onClose();
            }}
            style={{
              backgroundColor: type === 'error' ? colors.error : colors.primary,
            }}
          >
            <ButtonText style={{ color: colors.textInverse }}>
              {confirmText}
            </ButtonText>
          </Button>
        </HStack>
      );
    }

    // Default single OK button
    return (
      <Button
        variant="solid"
        size="sm"
        onPress={onClose}
        style={{
          backgroundColor: colors.primary,
          alignSelf: 'flex-end',
        }}
      >
        <ButtonText style={{ color: colors.textInverse }}>OK</ButtonText>
      </Button>
    );
  };

  const renderCustomActions = () => {
    if (!actions || actions.length === 0) {
      return renderDefaultActions();
    }

    return (
      <HStack space="sm" className="justify-end">
        {actions.map((action, index) => {
          const getButtonColors = () => {
            const scheme = action.colorScheme || 'primary';
            const baseColor = colors[scheme] || colors.primary;
            
            if (action.variant === 'outline') {
              return {
                backgroundColor: 'transparent',
                borderColor: baseColor,
                textColor: baseColor,
              };
            } else if (action.variant === 'link') {
              return {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: baseColor,
              };
            } else {
              return {
                backgroundColor: baseColor,
                borderColor: baseColor,
                textColor: colors.textInverse,
              };
            }
          };

          const buttonColors = getButtonColors();

          return (
            <Button
              key={index}
              variant={action.variant || 'solid'}
              size="sm"
              onPress={action.onPress}
              disabled={action.isLoading}
              style={{
                backgroundColor: buttonColors.backgroundColor,
                borderColor: buttonColors.borderColor,
                opacity: action.isLoading ? 0.7 : 1,
              }}
            >
              <ButtonText style={{ color: buttonColors.textColor }}>
                {action.isLoading ? 'Loading...' : action.text}
              </ButtonText>
            </Button>
          );
        })}
      </HStack>
    );
  };

  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size={size}>
      <AlertDialogBackdrop onPress={handleBackdropPress} />
      <AlertDialogContent
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <AlertDialogHeader>
          <HStack className="items-center flex-1" space="md">
            {/* Icon */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: dialogColors.iconBgColor,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                as={IconComponent}
                size="md"
                style={{ color: dialogColors.iconColor }}
              />
            </View>

            {/* Title */}
            <Heading
              size="md"
              style={{
                color: colors.text,
                flex: 1,
              }}
            >
              {title}
            </Heading>
          </HStack>

          {/* Close Button */}
          {showCloseButton && (
            <AlertDialogCloseButton
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: colors.surfaceSecondary,
              }}
            >
              <Icon as={X} size="sm" style={{ color: colors.textSecondary }} />
            </AlertDialogCloseButton>
          )}
        </AlertDialogHeader>

        {/* Body */}
        <AlertDialogBody>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            {message}
          </Text>
        </AlertDialogBody>

        {/* Footer */}
        <AlertDialogFooter>{renderCustomActions()}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Convenience components for specific dialog types
export const ConfirmDialog: React.FC<
  Omit<ReusableDialogProps, 'type'> & { onConfirm: () => void }
> = (props) => <ReusableDialog {...props} type="confirm" />;

export const InfoDialog: React.FC<Omit<ReusableDialogProps, 'type'>> = (
  props
) => <ReusableDialog {...props} type="info" />;

export const SuccessDialog: React.FC<Omit<ReusableDialogProps, 'type'>> = (
  props
) => <ReusableDialog {...props} type="success" />;

export const WarningDialog: React.FC<Omit<ReusableDialogProps, 'type'>> = (
  props
) => <ReusableDialog {...props} type="warning" />;

export const ErrorDialog: React.FC<Omit<ReusableDialogProps, 'type'>> = (
  props
) => <ReusableDialog {...props} type="error" />;

export default ReusableDialog;
