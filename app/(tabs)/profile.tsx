import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { fetchUserProfile } from "@/composables/useFetchUserProfile";
import DefaultProfile from "@/assets/images/default-profile.svg";
import * as SecureStore from "expo-secure-store";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "@expo/vector-icons/Ionicons";
import useNavigateToEditProfile from "@/composables/useNavigateToEditProfile";
import useNavigateToEmailNotificationSetting from "@/composables/useNavigateToEmailNotificationSetting";

const Profile = () => {
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<any>({});
  const { navigateToEditProfile } = useNavigateToEditProfile();
  const { navigateToEmailNotificationSetting } =
    useNavigateToEmailNotificationSetting();
  const [permission, requestPermission] = useCameraPermissions();

  const { authState, onLogout } = useAuth();

  const onLogoutPress = () => {
    onLogout!();
  };

  const loadUserProfile = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const user = await fetchUserProfile(token, "/v1/profile", "GET");
    setUserInfo(user);
  };

  const navigateToScanQR = () => {
    if (permission?.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow camera permission to scan QR code."
      );
      requestPermission();
      return;
    }
    if (userInfo.users_role === "Attendee") {
      Alert.alert("Access Denied", "You do not have permission to feature.");
      return;
    } else if (userInfo.users_role === "Organization") {
      requestPermission();
      navigation.navigate("ScanQR");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View style={styles.container}>
          {userInfo.users_image ? (
            <View className="justify-center items-center">
              <Image
                source={{ uri: userInfo.users_image }}
                style={{
                  width: 208, // เทียบเท่ากับ w-52
                  height: 208, // เทียบเท่ากับ h-52
                  borderRadius: 104, // ทำให้เป็นวงกลม
                  borderWidth: 4, // ความหนาของเส้นขอบ
                  borderColor: "#fff", // สีขอบ (gray-300)
                  alignSelf: "center", // เทียบเท่ากับ mx-auto
                }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <DefaultProfile className="w-52 h-52 rounded-full mx-auto mt-10" />
          )}
          <Text className="text-center mt-8 font-Poppins-Regular text-xl text-white">
            {userInfo.users_firstname} {userInfo.users_lastname}
          </Text>
          <Text className="text-center mt-2 font-Poppins-Regular text-lg text-white">
            {userInfo.username}
          </Text>
        </View>
        {/* <TouchableOpacity style={styles.menuList}>
          <Text style={styles.menuText}>User Detail</Text>
        </TouchableOpacity> */}
        <View style={styles.menuContainer}>
          <View style={styles.menuListContainer}>
            <View style={styles.headerMenu}>
              <Icon name="person" size={20} color="#000000" />
              <Text style={styles.headerTypeSetting}>Account Setting</Text>
              <View style={styles.headerTypeline} />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigateToEditProfile()}
                style={styles.menuList}
              >
                <View className="flex-row justify-between items-center">
                  <Text style={styles.menuText}>Edit Profile</Text>
                  <Icon name="chevron-forward" size={20} color="#000000" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuListContainer}>
            <View style={styles.headerMenu}>
              <Icon name="notifications" size={20} color="#000000" />
              <Text style={styles.headerTypeSetting}>Notification Setting</Text>
              <View style={styles.headerTypeline} />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => navigateToEmailNotificationSetting()}
                style={styles.menuList}
              >
                <View className="flex-row justify-between items-center">
                  <Text style={styles.menuText}>Manage Email Notification</Text>
                  <Icon name="chevron-forward" size={20} color="#000000" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {userInfo.users_role === "Organization" && (
            <TouchableOpacity
              onPress={() => navigateToScanQR()}
              style={styles.menuList}
            >
              <Text style={styles.menuText}>Scan QR Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <View>
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
  container: {
    justifyContent: "center", // จัดตำแหน่งแนวตั้ง
    backgroundColor: "#002642", // สีพื้นหลัง (ปรับได้ตามต้องการ)
    paddingVertical: 50, // ระยะห่างขอบจอ
  },
  menuContainer: {
    marginTop: 20,
    padding: 20,
  },
  headerMenu: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTypeSetting: {
    includeFontPadding: false,
    fontSize: wp("4%"),
    fontFamily: "Poppins-Bold",
    marginLeft: 6,
  },
  headerTypeline: {
    flex: 1, // ทำให้ขีดขยายไปจนสุดขอบขวา
    height: 2, // กำหนดความหนาของขีด
    backgroundColor: "#000", // สีดำ
    marginLeft: 10, // ระยะห่างจากข้อความ
  },
  menuListContainer: {
    marginBottom: 10,
  },
  menuList: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  menuText: {
    color: "#000000",
    fontSize: wp("4%"),
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    includeFontPadding: false,
  },
});

export default Profile;
