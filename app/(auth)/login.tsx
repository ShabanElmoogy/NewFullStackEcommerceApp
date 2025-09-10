import React, { useRef } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Pressable } from '@/components/ui/pressable';
import { useAuth } from '@/store/authStore';
import { Redirect, useRouter } from 'expo-router';
import { View, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginFormData } from '@/utils/validation/loginSchema';
import { ControlledInput, ControlledPasswordInput, LoginHeader, FormDivider, SocialLogin, LegalFooter } from '@/components/auth';

export default function LoginScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  
  const isLoggedIn = useAuth(s => !!s.user);
  const returnUrl = useAuth(s => s.returnUrl);
  const clearReturnUrl = useAuth(s => s.clearReturnUrl);
  
  const { control, handleSubmit, isValid, isLoading } = useLoginForm();

  const handlePasswordFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 200, animated: true });
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
          keyboardShouldPersistTaps="handled">
            
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
            
            <LoginHeader />

            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 28,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
                marginBottom: 20,
              }}
            >
              <VStack className="gap-6">
                {/* Email Field - Using Reusable Controlled Component */}
                <ControlledInput<LoginFormData>
                  name="email"
                  control={control}
                  label="Email"
                  placeholder="Enter your user name"
                  autoComplete="email"
                  showLabel={false}
                />

                {/* Password Field - Using Reusable Controlled Component */}
                <ControlledPasswordInput<LoginFormData>
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="Enter your password"
                  showLabel={false}
                  onFocus={handlePasswordFocus}
                />

                <View className="items-end">
                  <Text className="text-black font-medium text-sm underline">Forgot Password?</Text>
                </View>

                {/* Sign In Button - Using Reusable Button Component */}
                <Button
                  className="bg-black rounded-xl h-14"
                  onPress={handleSubmit}
                  isDisabled={!isValid || isLoading}
                >
                  <ButtonText className="text-white font-semibold text-base">
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </ButtonText>
                </Button>

                <FormDivider />

                <SocialLogin />

                {/* Sign Up Link - Using Reusable Components */}
                <View className="flex-row justify-center items-center">
                  <Text className="text-gray-600 text-base">Don't have an account? </Text>
                  <Pressable onPress={() => router.push('/register')}>
                    <Text className="text-black font-semibold text-base underline">Sign Up</Text>
                  </Pressable>
                </View>
              </VStack>
            </View>

            <LegalFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}