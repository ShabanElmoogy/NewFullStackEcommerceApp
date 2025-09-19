import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Input, InputField } from '@/components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { Icon } from '@/components/ui/icon';
import { LucideIcon } from 'lucide-react-native';
import { TextInputProps } from 'react-native';

interface ControlledInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: TextInputProps['autoComplete'];
  className?: string;
  rightElement?: React.ReactNode;
  showLabel?: boolean;
  onFocus?: () => void;
}

export function ControlledInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  icon: IconComponent,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  className = '',
  rightElement,
  showLabel = true,
  onFocus,
}: ControlledInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormControl isInvalid={!!error}>
          {showLabel && (
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
          )}
          <Input className={`h-12 ${className}`}>
            {IconComponent && (
              <Icon as={IconComponent} size="sm" className="text-typography-400 ml-3" />
            )}
            <InputField
              placeholder={placeholder}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoComplete={autoComplete}
            />
            {rightElement}
          </Input>
          <FormControlError>
            <FormControlErrorText>{error?.message}</FormControlErrorText>
          </FormControlError>
        </FormControl>
      )}
    />
  );
}
