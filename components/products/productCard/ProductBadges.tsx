import React from "react";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { TrendingUp } from "lucide-react-native";

export const ProductBadges: React.FC<{
  isNew?: boolean;
  isTrending?: boolean;
  discount?: number;
}> = ({ isNew, isTrending, discount }) => (
  <>
    {isNew && (
      <Badge className="bg-success-500">
        <BadgeText className="text-white text-xs font-semibold">NEW</BadgeText>
      </Badge>
    )}
    {isTrending && (
      <Badge className="bg-warning-500">
        <Icon as={TrendingUp} size="xs" className="text-white mr-1" />
        <BadgeText className="text-white text-xs font-semibold">HOT</BadgeText>
      </Badge>
    )}
    {typeof discount === "number" && discount > 0 && (
      <Badge className="bg-error-500">
        <BadgeText className="text-white text-xs font-semibold">-{discount}%</BadgeText>
      </Badge>
    )}
  </>
);
