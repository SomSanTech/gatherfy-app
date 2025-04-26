import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserProfile } from "@/composables/useFetchUserProfile";
import DefaultProfile from "@/assets/images/default-profile.svg";
import * as SecureStore from "expo-secure-store";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "@expo/vector-icons/Ionicons";
import EditProfileIcon from "@/assets/icons/person-edit.svg";
import useNavigateToEditProfile from "@/composables/useNavigateToEditProfile";
import useNavigateToEmailNotificationSetting from "@/composables/useNavigateToEmailNotificationSetting";
import useNavigateToResetPassword from "@/composables/useNavigateToResetPassword";
import { ScrollView } from "react-native-gesture-handler";
import CustomButton from "@/components/CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const Profile = () => {
  const navigation = useNavigation<any>();
  const [userInfo, setUserInfo] = useState<any>({});
  const { navigateToEditProfile } = useNavigateToEditProfile();
  const { navigateToEmailNotificationSetting } =
    useNavigateToEmailNotificationSetting();
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);

  const { onLogout } = useAuth();

  const onLogoutPress = () => {
    closeLogOutModal();
    onLogout!();
  };

  const closeLogOutModal = () => {
    setModalVisible(false);
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
    } else if (userInfo.users_role === "Organizer") {
      requestPermission();
      navigation.navigate("ScanQR");
    }
  };

  const { navigateToResetPassword } = useNavigateToResetPassword();

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [])
  );

  return (
    <Fragment>
      <StatusBar backgroundColor="transparent" style="dark" />
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <ScrollView
          className="bg-white"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.container}>
            {userInfo.users_image ? (
              <View className="justify-center items-center">
                <View
                  style={{
                    width: 208, // เทียบเท่ากับ w-52
                    height: 208, // เทียบเท่ากับ h-52
                    borderRadius: 104, // ทำให้เป็นวงกลม
                    borderWidth: 4, // ความหนาของเส้นขอบ
                    borderColor: "#cdcdcd", // สีขอบ (gray-300)
                    alignSelf: "center", // เทียบเท่ากับ mx-auto
                    elevation: 4, // เงา
                    shadowColor: "#000", // สีเงา
                  }}
                >
                  <Image
                    source={{ uri: userInfo.users_image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 104, // ทำให้เป็นวงกลม
                    }}
                    resizeMode="cover"
                  />
                </View>
              </View>
            ) : (
              <Image
                source={require("@/assets/icons/person-fill-icon.png")}
                className="opacity-60 w-52 h-52 rounded-full mx-auto mt-10"
              />
            )}
            <Text className="text-center mt-8 font-Poppins-Regular text-xl text-black">
              {userInfo.users_firstname} {userInfo.users_lastname}
            </Text>
            <Text className="text-center mt-2 font-Poppins-Regular text-lg text-black">
              {userInfo.username}
            </Text>
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.menuListContainer}>
              <View style={styles.headerMenu}>
                <Text style={styles.headerTypeSetting}>Account Setting</Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => navigateToEditProfile()}
                  style={styles.menuList}
                >
                  <EditProfileIcon
                    width={24}
                    height={24}
                    style={{ marginRight: 10 }}
                  />
                  <View className="flex-row justify-between items-center flex-1">
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Icon name="chevron-forward" size={20} color="#000000" />
                  </View>
                </TouchableOpacity>
                <View style={styles.listLine} />
                <TouchableOpacity
                  onPress={() => navigateToResetPassword()}
                  style={styles.menuList}
                >
                  <Icon
                    name="key-outline"
                    size={20}
                    color="#000000"
                    style={{ marginRight: 10 }}
                  />
                  <View className="flex-row justify-between items-center flex-1">
                    <Text style={styles.menuText}>Change Password</Text>
                    <Icon name="chevron-forward" size={20} color="#000000" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.menuListContainer}>
              <View style={styles.headerMenu}>
                <Text style={styles.headerTypeSetting}>
                  Notification Setting
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => navigateToEmailNotificationSetting()}
                  style={styles.menuList}
                >
                  <Icon
                    name="mail-outline"
                    size={20}
                    color="#000000"
                    style={{ marginRight: 10 }}
                  />
                  <View className="flex-row justify-between items-center flex-1">
                    <Text style={styles.menuText}>
                      Manage Email Notification
                    </Text>
                    <Icon name="chevron-forward" size={20} color="#000000" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {userInfo.users_role === "Organizer" && (
              <View style={styles.menuListContainer}>
                <View style={styles.headerMenu}>
                  <Text style={styles.headerTypeSetting}>Organizer Menu</Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigateToScanQR()}
                    style={styles.menuList}
                  >
                    <Icon
                      name="qr-code-outline"
                      size={20}
                      color="#000000"
                      style={{ marginRight: 10 }}
                    />
                    <View className="flex-row justify-between items-center flex-1">
                      <Text style={styles.menuText}>Scan QR to Check-in</Text>
                      <Icon name="chevron-forward" size={20} color="#000000" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View>
            <CustomButton
              title="Logout"
              handlePress={() => setModalVisible(true)}
              containerStyles={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: Colors.primary,
                width: 200,
                alignSelf: "center",
                marginTop: 10,
                marginBottom: 20,
              }}
              textStyle={{
                color: Colors.primary,
                fontFamily: "Poppins-Bold",
                fontSize: wp("4%"),
              }}
              classNameContainerStyle="w-full py-3 bg-primary rounded-xl flex-row justify-center items-center"
              classNameTextStyle="font-Poppins-Bold text-lg text-center text-white"
              IconComponent={
                <Icon
                  name="log-out-outline"
                  size={20}
                  color="white"
                  style={{ marginRight: 10, color: Colors.primary }}
                />
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View className="pt-10 pb-5 items-center justify-between">
                <Ionicons
                  name="log-out-outline"
                  size={40}
                  style={{ marginBottom: 20 }}
                />
                <Text style={styles.modalTitle}>Logout</Text>
                <Text style={styles.modalDescriptionText}>
                  Are you sure you want to log out?
                </Text>
              </View>
              <View style={styles.modalContentList}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={onLogoutPress}
                >
                  <Text style={styles.optionText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionCancelButton}
                  onPress={closeLogOutModal}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // จัดตำแหน่งแนวตั้ง
    alignItems: "center", // จัดตำแหน่งแนวนอน
    paddingTop: 50, // ระยะห่างขอบจอ
  },
  menuContainer: {
    padding: 20,

    paddingBottom: 0,
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
  listLine: {
    width: "100%", // ให้กว้างเต็มพื้นที่ของ parent
    height: 1,
    backgroundColor: "#dadada", // สีดำ
    alignSelf: "stretch", // ทำให้เส้นยืดเต็มความกว้างของ parent
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: wp("95%"), // กำหนดความกว้างเป็น 90% ของหน้าจอ
    height: hp("55%"), // กำหนดความสูงเป็น 50% ของหน้าจอ
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: wp("52%"),
  },
  IconContainer: {
    width: wp("10%"),
    includeFontPadding: false,
    alignItems: "center",
  },
  closeButtonModal: {
    fontSize: wp("3.5%"), // ขนาด font เป็น 4% ของหน้าจอ
    color: "#000000",
    fontFamily: "Poppins-Bold",
  },
  checkboxWrapper: {
    marginTop: wp(2),
    flex: 2.5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  checkboxContainer: {
    width: wp("30%"), // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
    marginBottom: 18,
    borderWidth: 0,
  },
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#A9A9A9",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerText: {
    includeFontPadding: false,
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
  editImageContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10, // เพื่อให้แน่ใจว่าอยู่เหนือภาพ
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingBottom: 15,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: wp("6.5%"),
    fontFamily: "Poppins-Bold",
    includeFontPadding: false,
    textAlign: "center",
    marginBottom: 10,
  },
  modalDescriptionText: {
    fontSize: wp("3.5%"),
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
    textAlign: "center",
    marginBottom: 10,
  },
  modalContentList: {
    flexDirection: "row", // จัดเรียงปุ่มในแนวนอน
    justifyContent: "space-around", // จัดระยะห่างระหว่างปุ่ม
    width: "100%",
    paddingHorizontal: 10,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  optionButtonContainer: {
    flexDirection: "row", // จัดเรียงปุ่มในแนวนอน
    justifyContent: "space-around", // จัดระยะห่างระหว่างปุ่ม
    width: "100%", // ให้ container กว้าง 100% ของหน้าจอ
  },
  optionCancelButton: {
    padding: 15,
    alignItems: "center",
    borderColor: "#ccc",
    borderRadius: 10,
    flex: 1, // ใช้ flex เพื่อให้ปุ่มขยายได้
    marginHorizontal: 5, // ให้มีช่องว่างระหว่างปุ่ม
    marginTop: 10, // ให้มีช่องว่างระหว่างปุ่ม
    justifyContent: "center", // จัดให้ข้อความอยู่ตรงกลาง
  },
  optionButton: {
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    flex: 1, // ใช้ flex เพื่อให้ปุ่มขยายได้
    marginHorizontal: 5, // ให้มีช่องว่างระหว่างปุ่ม
    marginTop: 10, // ให้มีช่องว่างระหว่างปุ่ม
    justifyContent: "center", // จัดให้ข้อความอยู่ตรงกลาง
  },
  cancelText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  optionText: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
});

export default Profile;
