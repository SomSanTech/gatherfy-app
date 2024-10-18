import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Tag = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View>
          <Text>Tag</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Tag;
