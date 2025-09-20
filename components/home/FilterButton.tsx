import React from 'react';
import { Pressable, View } from 'react-native';
import { Filter } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring
} from 'react-native-reanimated';

interface FilterButtonProps {
  onPress: () => void;
  size?: number;
  iconSize?: number;
}

export default function FilterButton({ 
  onPress, 
  size = 48, 
  iconSize = 20 
}: FilterButtonProps) {
  const scaleAnimation = useSharedValue(1);
  const { colors } = useTheme();

  const handlePress = () => {
    scaleAnimation.value = withSpring(0.95, { damping: 10, stiffness: 200 }, () => {
      scaleAnimation.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  return (
    <Animated.View 
      style={animatedStyle}
      className="shrink-0"
    >
      <Pressable 
        onPress={handlePress} 
        className="opacity-80 active:opacity-60 transition-opacity duration-150"
      >
        <View 
          className="rounded-full items-center justify-center shadow-lg border border-opacity-20"
          style={{
            width: size,
            height: size,
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            borderColor: colors.border,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Filter size={iconSize} color={colors.textSecondary} />
        </View>
      </Pressable>
    </Animated.View>
  );
}