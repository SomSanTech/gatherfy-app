import React from "react";
import { TouchableOpacity, ViewStyle ,View} from "react-native";
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      activeOpacity={1}
      onPress={onPress} // ทำให้การเปลี่ยนแท็บยังทำงานได้
    >
        <View
            style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            }}
        >
            {children}
        </View>
    </TouchableOpacity>
  );
};

export default CustomTabBarButton;
