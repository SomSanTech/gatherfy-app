import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import UnderConstruction from "@/components/UnderConstruction";
import { Button } from "react-native-elements";

const Profile = () => {
  return (
    <Fragment>
      <SafeAreaView className="bg-white"></SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require("@/assets/profile.png")}
          className="w-52 h-52 rounded-full mx-auto mt-10"
        />
        <Text className="text-center mt-10 font-Poppins-Regular text-2xl">
          Profile
        </Text>
      </View>
      <View style={styles.container}>
        <Button
          title="Logout"
          type="outline"
          buttonStyle={{
            backgroundColor: "white",
            borderColor: "red",
            borderWidth: 1,
            width: 200,
            alignSelf: "center",
          }}
          titleStyle={{ color: "red" }}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // จัดตำแหน่งแนวตั้ง
    backgroundColor: "#ffffff", // สีพื้นหลัง (ปรับได้ตามต้องการ)
  },
});

export default Profile;
