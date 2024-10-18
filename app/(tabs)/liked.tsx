import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Liked = () => {
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View>
          <Text>Liked</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Liked;
