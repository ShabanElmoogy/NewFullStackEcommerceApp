import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';

interface EmailFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  errorText?: string | null;
}

export function EmailField({ value, onChangeText, errorText }: EmailFieldProps) {
  return (
    <VStack space="sm">
      <Text className="text-gray-700 font-semibold text-base ml-1">Email Address</Text>
      <FormControl isInvalid={!!errorText}>
        <Input className="bg-gray-50 border-gray-200 rounded-xl h-14">
          <InputField
            value={value}
            onChangeText={onChangeText}
            type="text"
            placeholder="Enter your email"
            className="text-gray-800 text-base px-4"
            placeholderTextColor="#9CA3AF"
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
}