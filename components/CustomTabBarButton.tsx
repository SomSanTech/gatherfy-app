import React from "react";
import { TouchableOpacity, View, Platform } from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

const CustomTabBarButton = ({
  accessibilityState,
  onPress,
  children,
}: BottomTabBarButtonProps) => {
  const isSelected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      style={{
        height:  60, // กำหนดความสูงให้แน่นอน
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      activeOpacity={1}
      onPress={onPress}
    >
      <View
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default CustomTabBarButton;
