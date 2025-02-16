import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState } from "react";
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
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { fetchUserProfile } from "@/composables/useFetchUserProfile";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<any>({});

  const [permission, requestPermission] = useCameraPermissions();

  const { authState, onLogout } = useAuth();
  const router = useRouter();

  const onLogoutPress = () => {
    onLogout!();
  };

  const loadUserProfile = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const user = await fetchUserProfile(token, "/v1/profile", "GET");
    setUserInfo(user);
  };
  const navigateToScanQR = () => {
    requestPermission();
    navigation.navigate("ScanQR");
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View style={styles.container}>
          <Image
            source={
              userInfo.users_image
                ? { uri: userInfo.users_image }
                : require("@/assets/images/default-profile.svg") // ใส่รูป default ถ้าไม่มีรูปผู้ใช้
            }
            className="w-52 h-52 rounded-full mx-auto mt-10"
            resizeMode="cover"
          />
          <Text className="text-center mt-8 font-Poppins-Regular text-2xl">
            {userInfo.username}
          </Text>
          <Text className="text-center mt-2 font-Poppins-Regular text-2xl">
            {userInfo.users_firstname} {userInfo.users_lastname}
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.menuContainer}>
          <Text style={styles.menuText}>User Detail</Text>
        </TouchableOpacity> */}
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
            onPress={onLogoutPress}
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
