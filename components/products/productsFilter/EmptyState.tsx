import React from "react";
import { View } from "react-native";
import { ShoppingBagIcon, RefreshCwIcon } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import { VStack } from "../../ui/vstack";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { Button, ButtonText } from "../../ui/button";
import CircleIcon from "../productCard/CircleIcon";

export interface EmptyStateProps {
  onRefresh: () => void;
  colors: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh, colors }) => {
  const { t } = useTranslation();
  
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 20,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <VStack className="items-center max-w-xs self-center">
        <CircleIcon
          colors={colors}
          icon={<ShoppingBagIcon color={colors.warning} size={40} />}
          tint={colors.warning + "20"}
        />
        <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
          {t('products.empty.noProducts')}
        </Text>
        <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
          {t('products.empty.noProductsSubtitle')}
        </Text>
        <Button
          onPress={onRefresh}
          className="rounded-full mt-2"
          style={{
            backgroundColor: colors.primary,
            height: 48,
            paddingHorizontal: 20,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <HStack className="items-center justify-center gap-2">
            <RefreshCwIcon color="#fff" size={20} />
            <ButtonText className="text-white font-semibold">{t('common.refresh')}</ButtonText>
          </HStack>
        </Button>
      </VStack>
    </View>
  );
};

export default EmptyState;
