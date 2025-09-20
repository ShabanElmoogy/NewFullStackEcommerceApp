import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { CarouselSlideData } from './types';
import Animated, { 
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface CarouselSlideProps {
  slide: CarouselSlideData;
  onPress: () => void;
  sparkleAnimatedStyle?: any;
  isSparkleSlide?: boolean;
}

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function CarouselSlide({ 
  slide, 
  onPress, 
  sparkleAnimatedStyle,
  isSparkleSlide = false 
}: CarouselSlideProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Get translated text, fallback to direct text if translation key not provided
  const getTranslatedText = (key?: string, fallback?: string) => {
    if (key) {
      return t(key);
    }
    return fallback || '';
  };

  const title = getTranslatedText(slide.titleKey, slide.title);
  const subtitle = getTranslatedText(slide.subtitleKey, slide.subtitle);
  const description = getTranslatedText(slide.descriptionKey, slide.description);
  const buttonText = getTranslatedText(slide.buttonTextKey, slide.buttonText);

  return (
    <AnimatedBox
      entering={FadeIn.duration(500)} 
      exiting={FadeOut.duration(300)}
      className="w-full h-full"
    >
      <Pressable
        onPress={onPress}
        className="w-full rounded-3xl overflow-hidden shadow-xl active:scale-98 transition-transform duration-200"
        style={{ 
          height: 220,
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
        }}
      >
        <Image
          source={{ uri: slide.image }}
          className="w-full h-full absolute inset-0"
          resizeMode="cover"
          alt={title}
        />

        {/* Gradient Overlay */}
        <Box className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <Box className="flex-1 p-5 justify-end relative z-10">
          
          {/* Icon */}
          <Box 
            className="absolute top-5 left-5 rounded-full p-2.5 backdrop-blur-sm"
            style={{ backgroundColor: `${colors.surface}40` }}
          >
            {isSparkleSlide && sparkleAnimatedStyle ? (
              <Animated.View style={sparkleAnimatedStyle}>
                <Icon 
                  as={slide.icon} 
                  size="xl" 
                  className="drop-shadow-sm"
                  style={{ color: '#FFFFFF' }}
                />
              </Animated.View>
            ) : (
              <Icon 
                as={slide.icon} 
                size="xl" 
                className="drop-shadow-sm"
                style={{ color: '#FFFFFF' }}
              />
            )}
          </Box>

          {/* Content */}
          <VStack space="xs" className="max-w-xs">
            <Text 
              className="text-3xl font-bold drop-shadow-lg leading-tight"
              style={{ color: '#FFFFFF' }}
            >
              {title}
            </Text>
            <Text 
              className="text-lg font-semibold drop-shadow-md"
              style={{ color: '#FFFFFF' }}
            >
              {subtitle}
            </Text>
            <Text 
              className="text-sm mb-3 drop-shadow-sm leading-relaxed opacity-90"
              style={{ color: '#FFFFFF' }}
            >
              {description}
            </Text>

            <Pressable
              onPress={onPress}
              className="px-5 py-2.5 rounded-full self-start shadow-lg active:scale-95 transition-transform duration-150"
              style={{ backgroundColor: colors.surface }}
            >
              <Text 
                className="font-bold text-sm"
                style={{ color: colors.text }}
              >
                {buttonText}
              </Text>
            </Pressable>
          </VStack>
        </Box>
      </Pressable>
    </AnimatedBox>
  );
}