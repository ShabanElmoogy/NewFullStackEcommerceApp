/**
 * Theme Toggle Component
 * Allows users to switch between light, dark, and system themes
 */

import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ThemeOptionProps {
  icon: React.ComponentType<any>;
  label: string;
  value: 'light' | 'dark' | 'system';
  isSelected: boolean;
  onPress: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  icon: IconComponent,
  label,
  value,
  isSelected,
  onPress,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isSelected ? 1 : 0.7);

  React.useEffect(() => {
    opacity.value = withTiming(isSelected ? 1 : 0.7, { duration: 200 });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          flex: 1,
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: isSelected ? colors.primary + '20' : colors.surfaceSecondary,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? colors.primary : colors.border,
        }
      ]}
    >
      <Icon
        as={IconComponent}
        size="lg"
        style={{ 
          color: isSelected ? colors.primary : colors.textSecondary,
          marginBottom: 8 
        }}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: isSelected ? '600' : '500',
          color: isSelected ? colors.primary : colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
};

interface ThemeToggleProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabels = true,
  orientation = 'horizontal',
}) => {
  const { colors, themePreference, setTheme } = useTheme();

  const themeOptions = [
    { icon: Sun, label: 'Light', value: 'light' as const },
    { icon: Moon, label: 'Dark', value: 'dark' as const },
    { icon: Monitor, label: 'System', value: 'system' as const },
  ];

  const Container = orientation === 'horizontal' ? HStack : VStack;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {showLabels && (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Theme
        </Text>
      )}
      
      <Container style={{ gap: 8 }}>
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.value}
            icon={option.icon}
            label={option.label}
            value={option.value}
            isSelected={themePreference === option.value}
            onPress={() => setTheme(option.value)}
          />
        ))}
      </Container>
    </View>
  );
};

// Simple toggle button version
export const ThemeToggleButton: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      onPress={toggleTheme}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }
      ]}
    >
      <Icon
        as={isDark ? Sun : Moon}
        size="md"
        style={{ color: colors.text }}
      />
    </AnimatedPressable>
  );
};
