import React from "react";
import { View } from "react-native";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Zap } from "lucide-react-native";

export const LowStockBadge: React.FC<{ stock: number }> = ({ stock }) => (
  <View className="absolute bottom-2 right-2">
    <Badge className="bg-warning-500">
      <Icon as={Zap} size="xs" className="text-white mr-1" />
      <BadgeText className="text-white text-xs">Only {stock} left</BadgeText>
    </Badge>
  </View>
);
