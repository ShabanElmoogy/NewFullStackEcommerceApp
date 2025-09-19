import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { RegisterHeader } from '@/components/auth/RegisterHeader';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-background-0" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-12 pb-6">
          {/* Header */}
          <RegisterHeader />

          {/* Form */}
          <RegisterForm />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
