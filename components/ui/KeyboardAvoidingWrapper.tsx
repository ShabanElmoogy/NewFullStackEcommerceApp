import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ViewStyle 
} from 'react-native';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollEnabled?: boolean;
  keyboardVerticalOffset?: number;
}

export default function KeyboardAvoidingWrapper({
  children,
  style,
  scrollEnabled = false,
  keyboardVerticalOffset = 0,
}: KeyboardAvoidingWrapperProps) {
  const behavior = Platform.OS === 'ios' ? 'padding' : 'height';

  if (scrollEnabled) {
    return (
      <KeyboardAvoidingView
        style={[{ flex: 1 }, style]}
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}