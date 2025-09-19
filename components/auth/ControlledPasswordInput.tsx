import React, { useState } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { ControlledInput } from './ControlledInput';

interface ControlledPasswordInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
  onFocus?: () => void;
}

export function ControlledPasswordInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Enter your password",
  className = '',
  showLabel = true,
  onFocus,
}: ControlledPasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <ControlledInput
      name={name}
      control={control}
      label={label}
      placeholder={placeholder}
      icon={Lock}
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      autoComplete="new-password"
      className={className}
      showLabel={showLabel}
      onFocus={onFocus}
      rightElement={
        <Pressable className="pr-3" onPress={togglePassword}>
          <Icon
            as={showPassword ? EyeOff : Eye}
            size="sm"
            style={{ color: colors.textSecondary }}
          />
        </Pressable>
      }
    />
  );
}
