import React from "react";
import { View } from "react-native";
import { ProductRating } from "../ProductRating";

export interface ProductCardListRatingProps { rating?: number; reviewCount?: number }

const ProductCardListRating: React.FC<ProductCardListRatingProps> = ({ rating, reviewCount }) => (
  <View className="mb-1.5">
    <ProductRating rating={rating} reviewCount={reviewCount} variant="list" showWhenEmpty={true} />
  </View>
);

export default ProductCardListRating;
