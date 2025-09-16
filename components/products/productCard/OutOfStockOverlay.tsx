import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export const OutOfStockOverlay: React.FC<{ label?: string }> = ({ label = "Out of Stock" }) => (
  <View className="absolute inset-0 bg-black/60 items-center justify-center">
    <Text className="text-white font-semibold text-sm">{label}</Text>
  </View>
);
