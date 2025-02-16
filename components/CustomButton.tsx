import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type CustomButtonProps = {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerStyles?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  classNameContainerStyle?: string;
  classNameTextStyle?: string;
  IconComponent?: React.ReactNode;
  disabled?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles,
  textStyle = "",
  isLoading = false,
  classNameContainerStyle = "",
  classNameTextStyle = "",
  IconComponent = null,
}) => {

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={classNameContainerStyle}
      style={containerStyles || defaultButtonStyle.button}
      disabled={isLoading}
    >
      {IconComponent}
      <Text
        className={classNameTextStyle}
        style={textStyle || defaultButtonStyle.buttonText}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const defaultButtonStyle = StyleSheet.create({
  button: {
    backgroundColor: "#ff9797",
    borderRadius: 10,
    minHeight: 62,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    opacity: 1,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: "SpaceMono",
  },
});

export default CustomButton;
