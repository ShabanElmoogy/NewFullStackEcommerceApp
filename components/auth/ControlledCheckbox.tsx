import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Checkbox, CheckboxIndicator, CheckboxIcon } from '@/components/ui/checkbox';
import { Check } from 'lucide-react-native';

interface ControlledCheckboxProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  children: React.ReactNode;
}

export function ControlledCheckbox<T extends FieldValues>({
  name,
  control,
  children,
}: ControlledCheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <VStack space="xs">
          <HStack className="items-start" space="sm">
            <Checkbox
              value="terms"
              isChecked={value || false}
              onChange={onChange}
              className="mt-1"
            >
              <CheckboxIndicator>
                <CheckboxIcon as={Check} />
              </CheckboxIndicator>
            </Checkbox>
            <View className="flex-1">
              {children}
            </View>
          </HStack>
          {error && (
            <Text className="text-error-600 text-sm ml-8">
              {error.message}
            </Text>
          )}
        </VStack>
      )}
    />
  );
}
