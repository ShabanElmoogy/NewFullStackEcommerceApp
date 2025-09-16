import React from "react";
import { View } from "react-native";

interface CircleIconProps {
  colors: any;
  icon: React.ReactNode;
  tint: string;
}

const CircleIcon: React.FC<CircleIconProps> = ({ colors, icon, tint }) => (
  <View
    className="w-30 h-30 rounded-full items-center justify-center mb-6 border"
    style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
  >
    <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: tint }}>
      {icon}
    </View>
  </View>
);

export default CircleIcon;
