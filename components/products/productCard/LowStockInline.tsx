import React from "react";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/useTheme";
import { Zap } from "lucide-react-native";

export const LowStockInline: React.FC<{ stock: number }> = ({ stock }) => {
  const { colors } = useTheme();
  return (
    <HStack space="xs" className="items-center">
      <Icon as={Zap} size="xs" style={{ color: colors.warning }} />
      <Text style={{ fontSize: 12, color: colors.warning }}>Only {stock} left</Text>
    </HStack>
  );
};
