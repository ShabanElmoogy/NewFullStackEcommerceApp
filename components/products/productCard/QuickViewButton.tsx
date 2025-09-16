import React from "react";
import { Pressable } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Eye } from "lucide-react-native";
import { Product } from "./types";

export const QuickViewButton: React.FC<{
  product: Product;
  onPress?: (product: Product) => void;
}> = ({ product, onPress }) => (
  <Pressable
    onPress={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onPress?.(product);
    }}
    className="w-8 h-8 bg-background-0/90 rounded-full items-center justify-center border border-outline-200 active:scale-95"
  >
    <Icon as={Eye} size="xs" className="text-typography-700" />
  </Pressable>
);
