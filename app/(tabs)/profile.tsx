import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import UnderConstruction from "@/components/UnderConstruction";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";

const Profile = () => {
  const navigation = useNavigation<any>();

  const [permission, requestPermission] = useCameraPermissions();


  const navigateToScanQR = () => {
    requestPermission();
    navigation.navigate("ScanQR");

  };
  const handleLogout = () => {
    // Reset navigation ไปยัง tab แรก
    navigation.reset({
      index: 0,
      routes: [{ name: "index" as never }], // เปลี่ยน "Home" เป็นชื่อ tab แรกของคุณ
    });
  };

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View style={styles.container}>
          <Image
            source={require("@/assets/profile.png")}
            className="w-52 h-52 rounded-full mx-auto mt-10"
          />
          <Text className="text-center mt-10 font-Poppins-Regular text-2xl">
            Profile
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("ScanQR")}
          style={styles.menuContainer}
        >
          <Text style={styles.menuText}>Scan QR Code</Text>
        </Pressable>
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
            onPress={handleLogout}
          />
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#b4b4b4",
  },
  menuText: {
    color: "#000000",
    fontSize: 16,
    textAlign: "left",
    padding: 20,
    paddingHorizontal: 25,
  },
  container: {
    flex: 1,
    justifyContent: "center", // จัดตำแหน่งแนวตั้ง
    backgroundColor: "#ffffff", // สีพื้นหลัง (ปรับได้ตามต้องการ)
  },
});

export default Profile;
