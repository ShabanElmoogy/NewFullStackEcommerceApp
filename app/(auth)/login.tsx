import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { useState } from 'react';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuth } from '@/store/authStore';
import { Redirect, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const setUser = useAuth(s => s.setUser);
  const setToken = useAuth(s => s.setToken);
  const returnUrl = useAuth(s => s.returnUrl);
  const clearReturnUrl = useAuth(s => s.clearReturnUrl);
  const isLoggedIn = useAuth(s => !!s.user);

  const loginMutation = useMutation({
    mutationFn: () =>
      login(email, password),
    onSuccess: (data) => {

      setUser(data);
      setToken(data.token);

      // Handle redirect after successful login
      if (returnUrl) {
        const redirectTo = returnUrl;
        clearReturnUrl();
        router.replace(redirectTo);
      } else {
        router.replace('/');
      }
    },
    onError: (error) => console.error(error),
  });

  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };

  if (isLoggedIn) {
    if (returnUrl) {
      const redirectTo = returnUrl;
      clearReturnUrl();
      return <Redirect href={redirectTo} />;
    }
    return <Redirect href={'/'} />
  }

  return (
    <FormControl isInvalid={!!loginMutation.error} className="p-4 border border-outline-200 rounded-lg w-full bg-white m-3">
      <VStack className="gap-4">
        <Heading className="text-typography-900">Login</Heading>
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <FormControl isInvalid={!!loginMutation.error}>
            <Input>
              <InputField
                value={email}
                onChangeText={setEmail}
                type="text"
              />
            </Input>
            {/* ✅ error annotation here */}
            {loginMutation.error && (
              <FormControlError>
                <FormControlErrorText>
                  {'required field'}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Password</Text>
          <FormControl isInvalid={!!loginMutation.error}>
            <Input>
              <InputField
                value={password}
                onChangeText={setPassword}
                type={showPassword ? 'text' : 'password'}
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            </Input>
            {/* ✅ error annotation here too */}
            {loginMutation.error && (
              <FormControlError>
                <FormControlErrorText>
                  {'required field'}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
        <HStack space="sm">
          <Button className="flex-1" variant='outline'>
            <ButtonText>Sign Up</ButtonText>
          </Button>
          <Button className="flex-1" onPress={() => loginMutation.mutate()}>
            <ButtonText>Sign In</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </FormControl>
  );
}