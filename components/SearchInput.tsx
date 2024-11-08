// import { View, Platform, Text } from "react-native";
// import { useState } from "react";
// import { SearchBar } from "@rneui/themed";
// import React from "react";

// type SearchBarComponentProps = {};

// const SearchInput: React.FunctionComponent<SearchBarComponentProps> = () => {
//   const [search, setSearch] = useState("");

//   const updateSearch = (search: string) => {
//     setSearch(search);
//   };

//   const isIOS = Platform.OS === "ios";
//   const isAndroid = Platform.OS === "android";

//   return (
//     <View className="mb-6 h-9">
//       <SearchBar
//         placeholder="Search"
//         onChangeText={updateSearch}
//         value={search}
//         platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
//         searchIcon={
//           Platform.OS === "ios" ? { name: "search" } : { name: "search" }
//         }
//         clearIcon={
//           Platform.OS === "ios" ? { name: "close-circle" } : { name: "close" }
//         }
//         returnKeyType="search"
//         inputStyle={{ color: "#D71515" }}
//         inputContainerStyle={{ height: 20 }}
//         containerStyle={{
//           backgroundColor: "transparent",
//           borderBottomWidth: 0,
//           borderTopWidth: 0,
//         }}
//         cancelButtonProps={{
//           color: "#D71515", // Set the color of the cancel button here
//         }}
//       />
//       <View>
//         <Text>{search}</Text>
//       </View>
//     </View>
//   );
// };

// export default SearchInput;
// import { View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Text, Keyboard ,Button } from "react-native";
// import React from "react";
// import { SearchBar } from "@rneui/themed";
// import { useAppContext } from "@/components/AppContext";

// const SearchInput: React.FC = () => {
//   const { search, setSearch } = useAppContext();

//   const updateSearch = (search: string) => {
//     setSearch(search);
//   };

//   const isIOS = Platform.OS === "ios";
//   const isAndroid = Platform.OS === "android";

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View>
//           <View className="mb-6 h-9">
//             <SearchBar
//               placeholder="Search"
//               onChangeText={updateSearch}
//               value={search} /* use search from Context */
//               platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
//               searchIcon={Platform.OS === "ios" ? { name: "search" } : { name: "search" }}
//               clearIcon={Platform.OS === "ios" ? { name: "close-circle" } : { name: "close" }}
//               returnKeyType="search"
//               inputStyle={{ color: "#D71515" }}
//               inputContainerStyle={{ height: 20 }}
//               containerStyle={{
//                 backgroundColor: "transparent",
//                 borderBottomWidth: 0,
//                 borderTopWidth: 0,
//               }}
//               cancelButtonProps={{
//                 color: "#D71515",
//               }}
//             />
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// export default SearchInput;


import { View, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Text, Keyboard, Button } from "react-native";
import React from "react";
import { SearchBar } from "@rneui/themed";
import { useAppContext } from "@/components/AppContext";

const SearchInput: React.FC = () => {
  const { search, setSearch } = useAppContext();
  const { isLoading, setIsLoading } = useAppContext();

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  const updateLoading = (value: boolean) => {
    setIsLoading(value);
  }

  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View className="mb-6 h-9">
            <SearchBar
              placeholder="Search"
              onChangeText={updateSearch}
              value={search} // ใช้ search จาก Context
              platform={isIOS ? "ios" : isAndroid ? "android" : "default"}
              searchIcon={Platform.OS === "ios" ? { name: "search" } : { name: "search" }}
              clearIcon={Platform.OS === "ios" ? { name: "close-circle" } : { name: "close" }}
              returnKeyType="search"
              inputStyle={{ color: "#D71515" }}
              inputContainerStyle={{ height: 20 }}
              containerStyle={{
                backgroundColor: "transparent",
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}
              cancelButtonProps={{
                color: "#D71515",
              }}
              onSubmitEditing={() => updateLoading(true)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SearchInput;
