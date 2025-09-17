import React from "react";
import { View } from "react-native";
import { Image } from "@/components/ui/image";
import { Text } from "../../ui/text";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import { useTheme } from "@/hooks/useTheme";
import {
  ProductLinkWrapper,
  AddToCartButton,
  ProductRating,
  ProductPrice,
} from "./ProductCardParts";
import { Product } from "./types";
import { useProductCard } from "./useProductCard";

interface ProductCardListViewProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export default function ProductCardListView({ product, onPress }: ProductCardListViewProps) {
  const {
    name,
    price,
    image,
    description,
    rating,
    reviewCount,
    discount,
    stock,
    isRTL,
    isOutOfStock,
    isLowStock,
    hasDiscount,
  } = useProductCard(product);
  
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 8,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <ProductLinkWrapper product={product} onPress={onPress}>
        <View style={{ padding: 16 }}>
          {/* Top Section - Image and Action Buttons */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
            {/* IMAGE CONTAINER */}
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: colors.backgroundSecondary,
                position: 'relative',
              }}
            >
              <Image
                source={{ uri: image || "https://via.placeholder.com/300x300?text=No+Image" }}
                style={{ 
                  width: "100%", 
                  height: "100%",
                  borderRadius: 12,
                }}
                resizeMode="cover"
                alt={`${name} image`}
              />
              
              {/* Discount Badge */}
              {hasDiscount && (
                <View
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    backgroundColor: '#FF4757',
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 10,
                    fontWeight: '700',
                  }}>
                    -{discount}%
                  </Text>
                </View>
              )}

              {/* Stock Status Overlay */}
              {isOutOfStock && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: '700',
                    textAlign: 'center',
                  }}>
                    OUT OF{'\n'}STOCK
                  </Text>
                </View>
              )}
            </View>

            {/* PRODUCT INFO */}
            <View style={{ flex: 1, minWidth: 0 }}>
              {/* Title and Action Buttons Row */}
              <View style={{ 
                flexDirection: "row", 
                alignItems: "flex-start",
                marginBottom: 8,
              }}>
                <View style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                  <Text 
                    style={{ 
                      fontSize: 16, 
                      fontWeight: "700",
                      color: colors.text,
                      lineHeight: 20,
                    }} 
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {name}
                  </Text>
                </View>
                
                {/* Action Buttons */}
                <View style={{ 
                  flexDirection: 'row', 
                  gap: 4,
                  flexShrink: 0,
                  alignItems: 'flex-start',
                }}>
                  <WishlistButton 
                    product={product} 
                    size="sm" 
                    variant="filled"
                  />
                  <CompareButton 
                    product={product} 
                    size="sm" 
                    variant="icon"
                  />
                </View>
              </View>

              {/* Rating */}
              <View style={{ marginBottom: 6 }}>
                <ProductRating 
                  rating={rating} 
                  reviewCount={reviewCount} 
                  variant="list"
                  showWhenEmpty={true}
                />
              </View>

              {/* Description */}
              {description && (
                <Text 
                  numberOfLines={2} 
                  style={{ 
                    fontSize: 13, 
                    color: colors.textSecondary,
                    lineHeight: 18,
                    marginBottom: 8,
                  }}
                  ellipsizeMode="tail"
                >
                  {description}
                </Text>
              )}
            </View>
          </View>

          {/* Bottom Section - Price and Add to Cart */}
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-between",
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border + '20',
          }}>
            <View style={{ flex: 1 }}>
              <ProductPrice 
                price={price} 
                discount={discount} 
                variant="list" 
              />
              {isLowStock && !isOutOfStock && (
                <View style={{ marginTop: 4 }}>
                  <Text style={{
                    fontSize: 11,
                    color: '#FF6B35',
                    fontWeight: '600',
                  }}>
                    Only {stock} left in stock
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ marginLeft: 12 }}>
              <AddToCartButton 
                product={product} 
                variant="compact"
                stableLayout={true}
              />
            </View>
          </View>
        </View>
      </ProductLinkWrapper>
    </View>
  );
}