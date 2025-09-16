import React from "react";
import { View } from "react-native";
import { SparklesIcon } from "lucide-react-native";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";

interface SuggestionBoxProps {
  colors: any;
}

const suggestions = [
  "Check your spelling",
  "Use more general keywords",
  "Try different terms",
  "Remove some filters",
];

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ colors }) => (
  <View
    className="rounded-2xl p-5 border"
    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
  >
    <HStack className="items-center mb-4 gap-2">
      <SparklesIcon color={colors.primary} size={20} />
      <Text className="text-base font-semibold" style={{ color: colors.text }}>
        Try these suggestions
      </Text>
    </HStack>
    {suggestions.map((s, i) => (
      <HStack key={i} className="items-center mb-2 gap-3">
        <View className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
        <Text className="text-sm flex-1" style={{ color: colors.textSecondary }}>
          {s}
        </Text>
      </HStack>
    ))}
  </View>
);

export default SuggestionBox;
