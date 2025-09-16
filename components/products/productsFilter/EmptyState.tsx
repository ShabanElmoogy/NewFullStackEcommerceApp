import React from "react";
import { ShoppingBagIcon, RefreshCwIcon } from "lucide-react-native";
import { VStack } from "../../ui/vstack";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { Button, ButtonText } from "../../ui/button";
import CircleIcon from "../productCard/CircleIcon";

export interface EmptyStateProps {
  onRefresh: () => void;
  colors: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh, colors }) => (
  <VStack className="items-center max-w-xs self-center">
    <CircleIcon
      colors={colors}
      icon={<ShoppingBagIcon color={colors.warning} size={40} />}
      tint={colors.warning + "20"}
    />
    <Text className="text-2xl font-bold text-center mb-2" style={{ color: colors.text }}>
      Coming soon
    </Text>
    <Text className="text-base text-center mb-6" style={{ color: colors.textSecondary }}>
      We're working hard to bring you amazing products. Check back soon!
    </Text>
    <Button onPress={onRefresh} className="py-3.5 px-6 rounded-xl" style={{ backgroundColor: colors.primary }}>
      <HStack className="items-center justify-center gap-2">
        <RefreshCwIcon color="#fff" size={20} />
        <ButtonText className="text-white font-semibold">Refresh</ButtonText>
      </HStack>
    </Button>
  </VStack>
);

export default EmptyState;
