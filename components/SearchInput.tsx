import { Ionicons } from "@expo/vector-icons";
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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
          <Ionicons name="search-outline" size={20} color="#626567" style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={"#626567"}
            onChangeText={onChangeText}
            inlineImageLeft='search_icon'
            value={value}
            onSubmitEditing={onSearchSubmit}
            style={styles.searchInput}
            underlineColorAndroid="transparent"
            enablesReturnKeyAutomatically={false}
          />
          {value !== "" && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onChangeText("")}
            >
              <Icon
                name="close-circle-outline"
                type="ionicon"
                size={20}
                color="#626567"
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
  searchIcon: {
    position: "absolute",
    left: 20,
    zIndex:20
  },
  searchInput: {
    fontFamily: "Poppins-Regular",
    fontSize: Platform.OS === "ios" ? wp("3.6%") : wp("3%"),
    lineHeight: 22,
    height: 45,
    // borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 120,
    paddingHorizontal: 50,
    paddingVertical: 10, // ลด vertical padding
    textAlignVertical: "center", // จัดข้อความให้อยู่ตรงกลาง
    includeFontPadding: false, // ปิด font padding ใน Android
    backgroundColor: "#F6F6F6"
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
