import React from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react-native';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { ControlledInput } from './ControlledInput';
import { ControlledPasswordInput } from './ControlledPasswordInput';
import { ControlledCheckbox } from './ControlledCheckbox';
import { SocialLogin } from './SocialLogin';
import { LoginLink } from './LoginLink';
import { RegisterFormData } from '@/utils/validation/registerSchema';

export const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    isValid,
    isLoading,
  } = useRegisterForm();

  return (
    <VStack space="lg">
      {/* Name Fields */}
      <HStack space="md">
        <View className="flex-1">
          <ControlledInput<RegisterFormData>
            name="firstName"
            control={control}
            label="First Name"
            placeholder="John"
            autoCapitalize="words"
          />
        </View>
        <View className="flex-1">
          <ControlledInput<RegisterFormData>
            name="lastName"
            control={control}
            label="Last Name"
            placeholder="Doe"
            autoCapitalize="words"
          />
        </View>
      </HStack>

      {/* Email Field */}
      <ControlledInput<RegisterFormData>
        name="email"
        control={control}
        label="Email Address"
        placeholder="john.doe@example.com"
        icon={Mail}
        keyboardType="email-address"
        autoComplete="email"
      />

      {/* Phone Field */}
      <ControlledInput<RegisterFormData>
        name="phone"
        control={control}
        label="Phone Number"
        placeholder="+1 (555) 123-4567"
        icon={Phone}
        keyboardType="phone-pad"
        autoComplete="tel"
      />

      {/* Password Field */}
      <ControlledPasswordInput<RegisterFormData>
        name="password"
        control={control}
        label="Password"
        placeholder="Enter your password"
      />

      {/* Confirm Password Field */}
      <ControlledPasswordInput<RegisterFormData>
        name="confirmPassword"
        control={control}
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      {/* Terms and Conditions */}
      <ControlledCheckbox<RegisterFormData>
        name="agreeToTerms"
        control={control}
      >
        <Text className="text-typography-600 text-sm leading-5">
          I agree to the{' '}
          <Text className="text-primary-600 font-medium">Terms of Service</Text>
          {' '}and{' '}
          <Text className="text-primary-600 font-medium">Privacy Policy</Text>
        </Text>
      </ControlledCheckbox>

      {/* Sign Up Button */}
      <Button
        className="h-12 mt-4"
        onPress={handleSubmit}
        isDisabled={!isValid || isLoading}
      >
        <ButtonText className="font-semibold">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </ButtonText>
      </Button>

      {/* Social Login */}
      <SocialLogin />

      {/* Login Link */}
      <LoginLink />
    </VStack>
  );
};