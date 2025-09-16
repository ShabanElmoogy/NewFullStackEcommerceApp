import React from "react";
import { View, Pressable } from "react-native";
import { GridIcon, ListIcon } from "lucide-react-native";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { Badge, BadgeText } from "../../ui/badge";
import type { FilterOptions } from "./ProductFilter";

export interface ResultsHeaderProps {
  isSearching: boolean;
  filteredCount: number;
  totalCount: number;
  filters?: FilterOptions;
  viewMode: "grid" | "list";
  updateViewMode: (mode: "grid" | "list") => void;
  colors: any;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  isSearching,
  filteredCount,
  totalCount,
  filters,
  viewMode,
  updateViewMode,
  colors,
}) => (
  <HStack className="justify-between items-center px-4 pt-3">
    <HStack className="items-center flex-1 gap-2">
      <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
        {isSearching
          ? `${filteredCount} results for "${filters?.searchQuery}"`
          : `${filteredCount} of ${totalCount} products`}
      </Text>
      {filteredCount !== totalCount && (
        <Badge
          className="border"
          style={{ backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }}
        >
          <BadgeText className="text-xs font-semibold" style={{ color: colors.primary }}>
            Filtered
          </BadgeText>
        </Badge>
      )}
    </HStack>

    <View
      className="rounded-xl p-1 mt-2 border"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <HStack className="gap-1">
        {["grid", "list"].map((mode) => {
          const Icon = mode === "grid" ? GridIcon : ListIcon;
          const active = viewMode === mode;
          return (
            <Pressable
              key={mode}
              onPress={() => updateViewMode(mode as "grid" | "list")}
              className="px-4 py-2.5 rounded-lg flex-row items-center gap-2"
              style={{ backgroundColor: active ? colors.primary : "transparent" }}
            >
              <Icon size={16} color={active ? "#fff" : colors.textSecondary} />
              <Text className="text-sm font-medium" style={{ color: active ? "#fff" : colors.textSecondary }}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </View>
  </HStack>
);

export default ResultsHeader;
