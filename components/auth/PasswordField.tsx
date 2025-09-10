import React, { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';

interface PasswordFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  errorText?: string | null;
  onFocus?: () => void;
}

export function PasswordField({ value, onChangeText, errorText, onFocus }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggle = () => setShowPassword((s) => !s);

  return (
    <VStack space="sm">
      <Text className="text-gray-700 font-semibold text-base ml-1">Password</Text>
      <FormControl isInvalid={!!errorText}>
        <Input className="bg-gray-50 border-gray-200 rounded-xl h-14">
          <InputField
            value={value}
            onChangeText={onChangeText}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="text-gray-800 text-base px-4 flex-1"
            placeholderTextColor="#9CA3AF"
            onFocus={onFocus}
          />
          <InputSlot className="pr-4" onPress={toggle}>
            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-500" size="lg" />
          </InputSlot>
        </Input>
        {errorText ? (
          <FormControlError>
            <FormControlErrorText className="text-red-500 text-sm mt-1">{errorText}</FormControlErrorText>
          </FormControlError>
        ) : null}
      </FormControl>
    </VStack>
  );
}