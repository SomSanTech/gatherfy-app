import { View, Platform, Text } from "react-native";
import { useState } from "react";
import { SearchBar } from "@rneui/themed";
import React from "react";

type SearchBarComponentProps = {};

const SearchInput: React.FunctionComponent<SearchBarComponentProps> = () => {
  const [search, setSearch] = useState("");

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  return (
    <View>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
        searchIcon={
          Platform.OS === "ios" ? { name: "search" } : { name: "search" }
        }
        clearIcon={
          Platform.OS === "ios" ? { name: "close-circle" } : { name: "close" }
        }
        returnKeyType="search"
        inputStyle={{ color: "#D71515" }}
        inputContainerStyle={{ height: 20 }}
        containerStyle={{
          backgroundColor: "transparent",
          borderBottomWidth: 0,
          borderTopWidth: 0,
        }}
        cancelButtonProps={{
          color: "#D71515", // Set the color of the cancel button here
        }}
      />
      <View>
        <Text>{search}</Text>
      </View>
    </View>
  );
};

export default SearchInput;
