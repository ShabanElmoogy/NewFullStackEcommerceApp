import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Icon } from '@/components/ui/icon';
import { Mail } from 'lucide-react-native';
import { RegisterFormData } from '@/utils/validation/registerSchema';

// Generic interface that works for both login and register
interface EmailFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  errorText?: string | null;
  showLabel?: boolean;
  placeholder?: string;
  className?: string;
}

// Register-specific interface
interface RegisterEmailFieldProps {
  email: string;
  error?: string;
  onInputChange: (field: keyof Omit<RegisterFormData, 'agreeToTerms'>, value: string) => void;
}

// Generic EmailField component for login and other forms
export const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChangeText,
  errorText,
  showLabel = true,
  placeholder = "john.doe@example.com",
  className = "",
}) => {
  if (showLabel) {
    return (
      <FormControl isInvalid={!!errorText}>
        <FormControlLabel>
          <FormControlLabelText>Email Address</FormControlLabelText>
        </FormControlLabel>
        <Input className={`h-12 ${className}`}>
          <Icon as={Mail} size="sm" className="text-typography-400 ml-3" />
          <InputField
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Input>
        <FormControlError>
          <FormControlErrorText>{errorText}</FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }

  // Login style without label
  return (
    <VStack space="sm">
      <Text className="text-gray-700 font-semibold text-base ml-1">Email</Text>
      <FormControl isInvalid={!!errorText}>
        <Input className="bg-gray-50 border-gray-200 rounded-xl h-14">
          <InputField
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            className="text-gray-800 text-base px-4 flex-1"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Input>
        {errorText ? (
          <FormControlError>
            <FormControlErrorText className="text-red-500 text-sm mt-1">{errorText}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
};

// Register-specific EmailField component
export const RegisterEmailField: React.FC<RegisterEmailFieldProps> = ({
  email,
  error,
  onInputChange,
}) => {
  return (
    <EmailField
      value={email}
      onChangeText={(value) => onInputChange('email', value)}
      errorText={error}
      showLabel={true}
    />
  );
};