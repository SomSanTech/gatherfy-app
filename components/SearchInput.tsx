import React, { useState } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Icon } from "react-native-elements";

const SearchInput: React.FC<{
  value: string;
  onSearchSubmit: () => void; // ส่งฟังก์ชันที่ทำการ fetch ข้อมูลเมื่อกด submit
  onChangeText: (value: string) => void;
}> = ({ value, onSearchSubmit, onChangeText }) => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <TextInput
            placeholder="Search"
            onChangeText={onChangeText}
            value={value}
            onSubmitEditing={onSearchSubmit}
            style={styles.searchInput}
          />
          {value !== "" && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChangeText("")}
            >
              <Icon
                name="close-circle-outline"
                type="ionicon"
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchInputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  searchInput: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    lineHeight: 22,
    height: 55,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 50,
    paddingVertical: 0, // ลด vertical padding
    textAlignVertical: "center", // จัดข้อความให้อยู่ตรงกลาง
    includeFontPadding: false, // ปิด font padding ใน Android
  },

  clearButton: {
    position: "absolute",
    right: 11,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
});

export default SearchInput;
