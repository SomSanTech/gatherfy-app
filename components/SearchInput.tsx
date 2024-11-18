import { View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Text, Keyboard, Button } from "react-native";
import React from "react";
import { SearchBar } from "@rneui/themed";
import { useAppContext } from "@/components/AppContext";
import { formatDuration } from "date-fns";

const SearchInput: React.FC = () => {
  const { search, setSearch } = useAppContext();
  const { isLoading, setIsLoading } = useAppContext();

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  const updateLoading = (value: boolean) => {
    setIsLoading(value);
  }

  const handleSearchPress = () => {
    updateLoading(true); // Set loading to true
  };

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className={Platform.OS === "android" ? "py-1" : "p-3"}>
          <View className={Platform.OS === "android" ? "mb-6 h-9 px-3 flex justify-center items-center" : "mb-6 h-9 "}>
            <SearchBar
              placeholder="Search"
              onChangeText={updateSearch}
              value={search} // ใช้ search จาก Context
              platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
              searchIcon={Platform.OS === "ios" ? { name: "search" } : { name: "search" }}
              clearIcon={Platform.OS === "ios" ? { name: "close-circle" } : { name: "close" }}
              returnKeyType="search"
              inputStyle={{ color: "#D71515" }}
              inputContainerStyle={Platform.OS === "ios" ? { height: 20 } : { height: 60 }}
             
              containerStyle={{
                backgroundColor: "transparent",
                borderBottomWidth: 0,
                borderTopWidth: 0,
                height: Platform.OS === "android" ? 60 : "auto",
              }}
              cancelButtonProps={{
                color: "#D71515",
              }}
              onSubmitEditing={handleSearchPress} 
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchInput;
