// SearchInput.tsx
import React from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SearchBar } from "@rneui/themed";

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={Platform.OS === "android" ? "py-1" : "p-3"}>
          <View
            className={
              Platform.OS === "android"
                ? "mb-6 h-9 px-3 flex justify-center items-center"
                : "mb-6 h-9 "
            }
          >
            <SearchBar
              placeholder="Search"
              onChangeText={onChangeText}
              value={value} // ใช้ค่า value ที่ส่งมาจาก props
              platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
              searchIcon={
                Platform.OS === "ios" ? { name: "search" } : { name: "search" }
              }
              clearIcon={
                Platform.OS === "ios"
                  ? { name: "close-circle" }
                  : { name: "close" }
              }
              returnKeyType="search"
              inputStyle={{
                color: "#D71515", // สีของข้อความใน input
                fontSize: 20,
                fontFamily: "Poppins-Regular",
                lineHeight: 30,
                marginTop: 4,
              }}
              inputContainerStyle={
                Platform.OS === "ios" ? { height: 20 } : { height: 60 }
              }
              showCancel={true}
              containerStyle={{
                backgroundColor: "transparent",
                borderBottomWidth: 0,
                borderTopWidth: 0,
                height: Platform.OS === "android" ? 60 : "auto",
              }}
              cancelButtonProps={{
                color: "#D71515",
              }}
              onSubmitEditing={onSearchSubmit} // เรียกใช้ onSearchSubmit เมื่อผู้ใช้กดปุ่ม search

            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchInput;
