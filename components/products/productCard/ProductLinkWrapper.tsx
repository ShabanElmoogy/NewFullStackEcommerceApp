import React from "react";
import { Pressable } from "react-native";
import { Product } from "./types";

let Link: any = null;
try {
  const ExpoRouter = require("expo-router");
  Link = ExpoRouter.Link;
} catch {}

export const ProductLinkWrapper: React.FC<{
  product: Product;
  onPress?: (product: Product) => void;
  children: React.ReactNode;
  className?: string;
  style?: any;
}> = ({ product, onPress, children, ...props }) => {
  if (Link && !onPress) {
    return (
      <Link href={`/product/${product.id}`} asChild>
        {/* @ts-ignore */}
        <Pressable {...props}>{children}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      onPress={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPress?.(product);
      }}
      {...props}
    >
      {children}
    </Pressable>
  );
};
