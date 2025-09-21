import React from "react";
import { View } from "react-native";
import { SearchIcon, XIcon, RefreshCwIcon } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import { VStack } from "../../ui/vstack";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { Button, ButtonText } from "../../ui/button";
import CircleIcon from "../productCard/CircleIcon";
import SuggestionBox from "./SuggestionBox";

export interface NoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
  onResetFilters: () => void;
  colors: any;
}

const NoResultsState: React.FC<NoResultsStateProps> = ({ searchQuery, onClearSearch, onResetFilters, colors }) => {
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
      <VStack className="items-center max-w-sm self-center">
        <CircleIcon colors={colors} icon={<SearchIcon color={colors.primary} size={40} />} tint={colors.primary + "20"} />
        <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
          {t('products.empty.noResults')}
        </Text>
        <Text className="text-base text-center mb-4" style={{ color: colors.textSecondary }}>
          {searchQuery.trim() ? `${t('products.empty.noResultsSubtitle')} "${searchQuery}"` : t('products.empty.noResultsSubtitle')}
        </Text>

        {searchQuery.trim().length > 0 && (
          <View
            style={{
              marginBottom: 16,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 9999,
              backgroundColor: colors.primary + "15",
              borderWidth: 1,
              borderColor: colors.primary + "30",
            }}
          >
            <HStack className="items-center gap-2">
              <SearchIcon color={colors.primary} size={14} />
              <Text style={{ color: colors.primary, fontWeight: "600" }}>
                {searchQuery.trim()}
              </Text>
            </HStack>
          </View>
        )}

        <HStack className="gap-3 mb-6">
          {searchQuery.trim() && (
            <Button
              onPress={onClearSearch}
              className="flex-1 rounded-full border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                height: 48,
                paddingHorizontal: 18,
              }}
            >
              <HStack className="items-center justify-center gap-2">
                <XIcon color={colors.textSecondary} size={20} />
                <ButtonText className="font-semibold" style={{ color: colors.textSecondary }}>
                  {t('products.empty.clearSearch')}
                </ButtonText>
              </HStack>
            </Button>
          )}
          <Button
            onPress={onResetFilters}
            className="flex-1 rounded-full"
            style={{
              backgroundColor: colors.primary,
              height: 48,
              paddingHorizontal: 18,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <HStack className="items-center justify-center gap-2">
              <RefreshCwIcon color="#fff" size={20} />
              <ButtonText className="text-white font-semibold">{t('products.empty.resetFilters')}</ButtonText>
            </HStack>
          </Button>
        </HStack>

        <SuggestionBox colors={colors} />
      </VStack>
    </View>
  );
};

export default NoResultsState;
