import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { FormControl, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { useState, useRef } from 'react';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/auth';
import { useAuth } from '@/store/authStore';
import { Redirect, useRouter } from 'expo-router';
import { View, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scrollViewRef = useRef(null);

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

  const handlePasswordFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 200,
        animated: true,
      });
    }, 100);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 100}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: '#ffffff' }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
        >
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
            {/* Header Section */}
            <View style={{
              backgroundColor: '#000000',
              marginHorizontal: -24,
              marginTop: -50,
              paddingTop: 80,
              paddingBottom: 40,
              paddingHorizontal: 24,
              marginBottom: 40,
            }}>
              <VStack className="items-center">
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                  <Text style={{ fontSize: 20, color: '#000000', fontWeight: 'bold' }}>🛒</Text>
                </View>
                <Heading className="text-white text-lg font-bold text-center tracking-widest">
                  LUXE MART
                </Heading>
                <Text className="text-gray-300 text-xs text-center font-light tracking-wide mt-1">
                  Premium Shopping
                </Text>
              </VStack>
            </View>

            {/* Login Form */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 28,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              marginBottom: 20,
            }}>
              <VStack className="gap-6">
                {/* Email Input */}
                <VStack space="sm">
                  <Text className="text-gray-700 font-semibold text-base ml-1">
                    Email Address
                  </Text>
                  <FormControl isInvalid={!!loginMutation.error}>
                    <Input className="bg-gray-50 border-gray-200 rounded-xl h-14">
                      <InputField
                        value={email}
                        onChangeText={setEmail}
                        type="text"
                        placeholder="Enter your email"
                        className="text-gray-800 text-base px-4"
                        placeholderTextColor="#9CA3AF"
                      />
                    </Input>
                    {loginMutation.error && (
                      <FormControlError>
                        <FormControlErrorText className="text-red-500 text-sm mt-1">
                          Please enter a valid email address
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                </VStack>

                {/* Password Input */}
                <VStack space="sm">
                  <Text className="text-gray-700 font-semibold text-base ml-1">
                    Password
                  </Text>
                  <FormControl isInvalid={!!loginMutation.error}>
                    <Input className="bg-gray-50 border-gray-200 rounded-xl h-14">
                      <InputField
                        value={password}
                        onChangeText={setPassword}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="text-gray-800 text-base px-4 flex-1"
                        placeholderTextColor="#9CA3AF"
                        onFocus={handlePasswordFocus}
                      />
                      <InputSlot className="pr-4" onPress={handleState}>
                        <InputIcon 
                          as={showPassword ? EyeIcon : EyeOffIcon} 
                          className="text-gray-500"
                          size="lg"
                        />
                      </InputSlot>
                    </Input>
                    {loginMutation.error && (
                      <FormControlError>
                        <FormControlErrorText className="text-red-500 text-sm mt-1">
                          Password is required
                        </FormControlErrorText>
                      </FormControlError>
                    )}
                  </FormControl>
                </VStack>

                {/* Forgot Password */}
                <View className="items-end">
                  <Text className="text-black font-medium text-sm underline">
                    Forgot Password?
                  </Text>
                </View>

                {/* Sign In Button */}
                <Button 
                  className="h-14 rounded-xl mt-4"
                  style={{
                    backgroundColor: '#000000',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  onPress={() => loginMutation.mutate()}
                  disabled={loginMutation.isPending}
                >
                  <ButtonText className="text-white font-semibold text-lg">
                    {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                  </ButtonText>
                </Button>

                {/* Divider */}
                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-px bg-gray-300" />
                  <Text className="mx-4 text-gray-500 font-medium text-xs">OR</Text>
                  <View className="flex-1 h-px bg-gray-300" />
                </View>

                {/* Social Login Button */}
                <Button 
                  variant="outline" 
                  className="h-12 rounded-xl border-black"
                  style={{ borderColor: '#000000', borderWidth: 1 }}
                >
                  <HStack space="sm" className="items-center">
                    <Text style={{ fontSize: 16, color: '#000000' }}>G</Text>
                    <ButtonText className="text-black font-medium">
                      Continue with Google
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Sign Up Link */}
                <View className="items-center mt-6">
                  <HStack space="xs" className="items-center">
                    <Text className="text-gray-600">Don't have an account?</Text>
                    <Button 
                      variant="link" 
                      className="p-0"
                      onPress={() => router.push('/signup')}
                    >
                      <ButtonText className="text-black font-semibold underline">
                        Sign Up
                      </ButtonText>
                    </Button>
                  </HStack>
                </View>
              </VStack>
            </View>

            {/* Footer */}
            <View className="items-center mt-6 mb-8">
              <Text className="text-gray-500 text-sm text-center">
                By signing in, you agree to our Terms of Service{'\n'}
                and Privacy Policy
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}