import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { useState, useRef } from 'react';
import React from 'react';
import { useAuth } from '@/store/authStore';
import { Redirect, useRouter } from 'expo-router';
import { View, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import {
  LoginHeader,
  EmailField,
  PasswordField,
  SignInButton,
  FormDivider,
  SocialLogin,
  SignUpLink,
  LegalFooter,
} from '@/components/auth';
import { useLogin } from '@/hooks/useLogin';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);

  const router = useRouter();
  const isLoggedIn = useAuth(s => !!s.user);
  const returnUrl = useAuth(s => s.returnUrl);
  const clearReturnUrl = useAuth(s => s.clearReturnUrl);
  
  const { handleLogin, isLoading, error } = useLogin();

  const handlePasswordFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 200, animated: true });
    }, 100);
  };

  const onSignIn = () => {
    handleLogin(email, password);
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
                <EmailField value={email} onChangeText={setEmail} errorText={error ? 'Please enter a valid email address' : null} />
                <PasswordField value={password} onChangeText={setPassword} onFocus={handlePasswordFocus} errorText={error ? 'Password is required' : null} />

                <View className="items-end">
                  <Text className="text-black font-medium text-sm underline">Forgot Password?</Text>
                </View>

                <SignInButton onPress={onSignIn} loading={isLoading} />

                <FormDivider />

                <SocialLogin />

                <SignUpLink onPress={() => router.push('/signup')} />
              </VStack>
            </View>

            <LegalFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}