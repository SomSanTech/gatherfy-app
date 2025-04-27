import React, { useState, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { CheckBox } from "@rneui/themed";

interface AnimatedCheckBoxProps {
  tagTitle: string;
  isSelected: boolean;
  onToggle: () => void;
}

const AnimatedCheckBox: React.FC<AnimatedCheckBoxProps> = ({ tagTitle, isSelected, onToggle }) => {
  const backgroundColor = useRef(new Animated.Value(0)).current; // ค่าตั้งต้นของสี (0 = ไม่เลือก, 1 = เลือก)

  // เมื่อสถานะเปลี่ยน (เลือก/ไม่เลือก)
  React.useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: isSelected ? 1 : 0, // 1: สีเลือก, 0: สีไม่เลือก
      duration: 300, // ระยะเวลาเปลี่ยนสี (ms)
      useNativeDriver: false, // ใช้ false สำหรับสี background
    }).start();
  }, [isSelected]);

  // สร้างสีพื้นหลังแบบ Animated
  const interpolatedBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1], // 0: ไม่เลือก, 1: เลือก
    outputRange: ["#e0e0e0", "#6200ea"], // สีเมื่อไม่เลือก -> สีเมื่อเลือก
  });

  // สีข้อความแบบ Animated
  const interpolatedTextColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#000000", "#ffffff"], // สีข้อความไม่เลือก -> เลือก
  });

  return (
    <Animated.View
      style={[
        styles.checkboxContainer,
        { backgroundColor: interpolatedBackgroundColor },
      ]}
    >
      <CheckBox
        title={tagTitle}
        checked={isSelected}
        onPress={onToggle}
        containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
        textStyle={[
          styles.text,
          { color: interpolatedTextColor }, // ใช้สีข้อความที่เปลี่ยนแปลงได้
        ]}
      />
    </Animated.View>
  );
};


const styles = StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    checkboxContainer: {
      width: "45%",
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
    },
    text: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  
export default AnimatedCheckBox;