import React, { useRef } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { useAuth } from '@/store/authStore';
import { useTheme } from '@/hooks/useTheme';
import { Redirect, useRouter } from 'expo-router';
import { View, ScrollView, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { useLoginForm } from '@/hooks/useLoginForm';
import { LoginFormData } from '@/utils/validation/loginSchema';
import { ControlledInput, ControlledPasswordInput, LoginHeader, FormDivider, SocialLogin, LegalFooter } from '@/components/auth';

export default function LoginScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const { colors, isDark } = useTheme();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 120}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.background }}
          keyboardShouldPersistTaps="handled">

          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>

            <LoginHeader />

            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 28,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: colors.border,
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

                <ControlledPasswordInput<LoginFormData>
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="Enter your password"
                  showLabel={false}
                  onFocus={handlePasswordFocus}
                />

                <View className="items-end">
                  <Text style={{
                    color: colors.primary,
                    fontWeight: '500',
                    fontSize: 14,
                    textDecorationLine: 'underline'
                  }}>
                    Forgot Password?
                  </Text>
                </View>

                {/* Sign In Button - Using Reusable Button Component */}
                <Pressable
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                    height: 56,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: (!isValid || isLoading) ? 0.6 : 1,
                  }}
                  onPress={handleSubmit}
                  disabled={!isValid || isLoading}
                >
                  <Text style={{
                    color: colors.text,
                    fontWeight: '600',
                    fontSize: 16
                  }}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </Pressable>

                <FormDivider />

                <SocialLogin />

                {/* Sign Up Link - Using Reusable Components */}
                <View className="flex-row justify-center items-center">
                  <Text style={{
                    color: colors.textSecondary,
                    fontSize: 16
                  }}>
                    Don't have an account?{' '}
                  </Text>
                  <Pressable onPress={() => router.push('/register')}>
                    <Text style={{
                      color: colors.primary,
                      fontWeight: '600',
                      fontSize: 16,
                      textDecorationLine: 'underline'
                    }}>
                      Sign Up
                    </Text>
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
