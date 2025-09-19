import React, { RefObject } from 'react';
import { View, Modal, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { XIcon, RotateCcwIcon, CheckIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

const { height: screenHeight } = Dimensions.get('window');

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  scrollViewRef: RefObject<ScrollView>;
  productCount: number;
  children: React.ReactNode;
}

export default function FilterModal({
  isVisible,
  onClose,
  onApply,
  onReset,
  scrollViewRef,
  productCount,
  children,
}: FilterModalProps) {
  const { colors } = useTheme();

  const handleScroll = (event: any) => {
    // Handle scroll events if needed
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Handle Bar */}
        <View
          className="w-10 h-1 rounded-sm self-center mt-3 mb-4"
          style={{ backgroundColor: colors.border }}
        />

        {/* Header */}
        <HStack className="justify-between items-center px-5 mb-5">
          <Text className="text-xl font-extrabold" style={{ color: colors.text }}>
            Filter Products
          </Text>
          <Pressable onPress={onClose} className="p-1">
            <XIcon color={colors.textSecondary} size={24} />
          </Pressable>
        </HStack>

        <View className="flex-1">
          <ScrollView 
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={true}
            indicatorStyle="black"
            scrollIndicatorInsets={{ right: 3 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={true}
            alwaysBounceVertical={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            persistentScrollbar={true}
            fadingEdgeLength={0}
          >
            {children}

            {/* Results Preview */}
            <View
              className="mx-5 p-4 rounded-xl"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                {productCount} product{productCount !== 1 ? 's' : ''} found
              </Text>
            </View>
            
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View
          className="px-5 py-4 border-t"
          style={{
            borderTopColor: colors.border,
            backgroundColor: colors.surface,
          }}
        >
          <HStack className="gap-3">
            <Button
              onPress={onReset}
              className="border"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
                minWidth: 100,
              }}
            >
              <HStack className="items-center gap-2">
                <RotateCcwIcon color={colors.text} size={16} />
                <ButtonText style={{ color: colors.text }}>Reset</ButtonText>
              </HStack>
            </Button>
            <Button
              onPress={onApply}
              className="flex-1"
              style={{ backgroundColor: colors.primary }}
            >
              <HStack className="items-center gap-2">
                <CheckIcon color={colors.textInverse} size={18} />
                <ButtonText className="font-semibold" style={{ color: colors.textInverse }}>
                  Apply Filters
                </ButtonText>
              </HStack>
            </Button>
          </HStack>
        </View>
      </View>
    </Modal>
  );
}
