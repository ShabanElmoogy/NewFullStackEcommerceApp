import React from "react";
import ProductCardGridView from "./ProductCardGridView";
import ProductCardListView from "./ProductCardListView/ProductCardListView";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onPress?: (product: Product) => void;
}

export default function ProductCard({ product, viewMode = "grid", onPress }: ProductCardProps) {
  if (viewMode === "list") {
    return <ProductCardListView product={product} onPress={onPress} />;
  }

  return <ProductCardGridView product={product} onPress={onPress} />;
}
