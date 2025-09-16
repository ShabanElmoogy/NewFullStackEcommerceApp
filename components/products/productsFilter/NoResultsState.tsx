import React from "react";
import { SearchIcon, XIcon, RefreshCwIcon } from "lucide-react-native";
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

const NoResultsState: React.FC<NoResultsStateProps> = ({ searchQuery, onClearSearch, onResetFilters, colors }) => (
  <VStack className="items-center max-w-sm self-center">
    <CircleIcon colors={colors} icon={<SearchIcon color={colors.primary} size={40} />} tint={colors.primary + "20"} />
    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      No results found
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      {searchQuery.trim() ? `We couldn't find anything matching "${searchQuery}"` : "No products match your filters"}
    </Text>

    <HStack className="gap-3 mb-6">
      {searchQuery.trim() && (
        <Button
          onPress={onClearSearch}
          className="flex-1 py-3.5 rounded-xl border"
          style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
        >
          <HStack className="items-center justify-center gap-2">
            <XIcon color={colors.textSecondary} size={18} />
            <ButtonText className="font-semibold" style={{ color: colors.textSecondary }}>
              Clear search
            </ButtonText>
          </HStack>
        </Button>
      )}
      <Button onPress={onResetFilters} className="flex-1 py-3.5 rounded-xl" style={{ backgroundColor: colors.primary }}>
        <HStack className="items-center justify-center gap-2">
          <RefreshCwIcon color="#fff" size={18} />
          <ButtonText className="text-white font-semibold">Reset filters</ButtonText>
        </HStack>
      </Button>
    </HStack>

    <SuggestionBox colors={colors} />
  </VStack>
);

export default NoResultsState;
