import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  ImageBackground,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import * as SecureStore from "expo-secure-store";
import {
  fetchUserProfile,
  saveUserProfile,
} from "@/composables/useFetchUserProfile";
import DefaultProfile from "@/assets/images/default-profile.svg";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Datepicker from "@/components/Datepicker";
import formatDate from "@/utils/formatDate";
import { genderOptions } from "@/utils/genderOptions";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";
import Constants from "expo-constants";
import API from "@/utils/api";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

const API_MINIO_URL2 =
  Constants.expoConfig?.extra?.apiMinioUrl2 ||
  "http://cp24us1.sit.kmutt.ac.th:7070/profiles/";

const EditProfile = () => {
  const { updateProfile } = useAuth();
  const { navigateToGoBack } = useNavigateToGoBack();
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
  const [userGender, setUserGender] = useState<string | undefined>(undefined);

  // const loadUserProfile = async () => {
  //   const token = await SecureStore.getItemAsync("my-jwt");
  //   const user = await fetchUserProfile(token, "/v1/profile", "GET");

  //   setUserInfo(user);
  //   setUsername(user.username);
  //   setFirstname(user.users_firstname);
  //   setLastname(user.users_lastname);
  //   setPhone(user.users_phone);
  //   setDateOfBirth(user.users_birthday);
  //   setEmail(user.users_email);
  //   setProfileImage(user.users_image);
  //   setUserGender(user.users_gender);
  // };

  const loadUserProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      const user = await fetchUserProfile(token, "/v1/profile", "GET");

      console.log("User profile data:", user);

      if (!user) {
        throw new Error("User profile not found.");
      }

      // const replaceUrlImage = API_BASE_URL+"/";
      const replaceUrlImage = "http://cp24us1.sit.kmutt.ac.th:7070/profiles/";
      const imageName = user.users_image?.replace(replaceUrlImage, "") || null;

      setUserInfo(user);
      setUsername(user.username || "");
      setFirstname(user.users_firstname || "");
      setLastname(user.users_lastname || "");
      setPhone(user.users_phone || "");
      setDateOfBirth(user.users_birthday || "");
      setEmail(user.users_email || "");
      setCurrentImage(imageName || "");
      setProfileImage(user.users_image || null);
      setUserGender(user.users_gender || "");

      console.log("User profile loaded successfully:", currentImage);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      Alert.alert("Error", "Failed to load user profile.");
    }
  };

  const handleOpenDatePicker = () => {
    setOpen(!open);
  };

  const handleChangeDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  > = (dateOfBirth) => {
    setDateOfBirth(dateOfBirth);
    handleOpenDatePicker();
  };

  if (!updateProfile) {
    console.error("updateProfile function is not available.");
  }

  const handleSaveProfile = async () => {
    const missingFields = [];

    if (!firstname) missingFields.push("Firstname");
    if (!lastname) missingFields.push("Lastname");
    if (!username) missingFields.push("Username");
    if (!email) missingFields.push("Email");
    if (!phone) missingFields.push("Phone");
    if (!dateOfBirth) missingFields.push("Birthday");
    if (!userGender) missingFields.push("Gender");

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Fields",
        `Please fill in ${missingFields.join(", ")}`
      );
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (uploadImage) {
      const token = await SecureStore.getItemAsync("my-jwt");
      console.log("uploadImage", uploadImage);

      const formData = new FormData();
      const file = {
        uri: uploadImage,
        name: uploadImage.split("/").pop(),
        type: "image/jpeg",
      } as any;

      console.log("File data:", file);

      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        Alert.alert("Error", result.msg);
        return;
      }
    }

    if (updateProfile) {
      const result = await updateProfile(
        username,
        firstname,
        lastname,
        email,
        phone,
        dateOfBirth,
        userGender || ""
      );

      if (result.error) {
        Alert.alert("Error", result.msg);
      } else {
        Alert.alert("Success", "Profile updated successfully");
      }
    } else {
      Alert.alert("Error", "Update profile function is unavailable.");
    }
  };

  // const pickImage = async () => {
  //   const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== "granted") {
  //     Alert.alert(
  //       "Permission Denied",
  //       "Allow access to gallery to upload image."
  //     );
  //     return;
  //   }

  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ["images"],
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {

  //     console.log(result.assets[0]);

  //     setProfileImage(result.assets[0].uri);
  //     setUploadImage(result.assets[0].fileName || "");
  //     console.log("Current image:", uploadImage);
  //     console.log();

  //   }
  // };

  const pickImage = async () => {
    try {
      // ขอ permission ทั้งแกลเลอรีและกล้อง
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (galleryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Allow access to camera and gallery to upload an image."
        );
        return;
      }

      // ให้ผู้ใช้เลือกว่าจะใช้กล้องหรือแกลเลอรี
      Alert.alert("Select Image", "Choose an option", [
        {
          text: "Camera",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              setUploadImage(result.assets[0].fileName || "");
              console.log("Image selected from camera:", result.assets[0].uri);
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
            });

            if (!result.canceled) {
              setProfileImage(result.assets[0].uri);
              setUploadImage(result.assets[0].fileName || "");
              console.log("Image selected from gallery:", result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error", "Something went wrong while selecting an image.");
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navigateToGoBack}>
            <Icon name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>
        <TouchableWithoutFeedback>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity onPress={pickImage}>
              {/* {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-52 h-52 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <DefaultProfile className="w-52 h-52 rounded-full" />
              )} */}
              {userInfo?.users_image ? (
                <View style={styles.modalHeader}>
                  {userInfo?.auth_provider === "system" ? (
                    <ImageBackground
                      className="w-full h-full"
                      style={styles.systemImage}
                      source={{
                        uri: profileImage || userInfo?.users_image,
                      }}
                    >
                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(255,255,255,0)",
                          "rgba(0,0,0,0.65)",
                        ]}
                        locations={
                          Platform.OS === "android" ? [0, 0.4, 0.85] : [0.5, 0]
                        }
                        style={styles.linearBackground}
                      ></LinearGradient>
                    </ImageBackground>
                  ) : (
                    userInfo?.auth_provider === "google" && (
                      <View style={styles.modalHeader}>
                        <ImageBackground
                          className="w-full h-full"
                          blurRadius={3}
                          source={{
                            uri: userInfo.users_image,
                          }}
                        >
                          <LinearGradient
                            colors={[
                              "transparent",
                              "rgba(255,255,255,0)",
                              "rgba(0,0,0,0.65)",
                            ]}
                            locations={[0.5, 0]}
                            style={styles.linearBackground}
                          >
                            <View style={styles.googleImage}>
                              <Image
                                source={{
                                  uri: userInfo.users_image,
                                }}
                                className="w-36 h-36 rounded-full mb-5"
                              />
                              <Text className="text-center text-white text-3xl font-semibold">
                                {userInfo?.username}
                              </Text>
                              <Text className="text-center text-white text-xl pb-7">
                                {userInfo?.userProfile.users_firstname}{" "}
                                {userInfo?.userProfile.users_lastname}
                              </Text>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                    )
                  )}
                </View>
              ) : (
                userInfo?.users_image === null && (
                  <View style={styles.modalHeaderNoImage}>
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255,255,255,0)",
                        "rgba(0,0,0,0.5)",
                      ]}
                      locations={[0.4, 0.4]}
                      style={styles.linearBackground}
                    >
                      <View style={styles.googleImage}>
                        <Image
                          className="w-36 h-36 opacity-60"
                          source={require("@/assets/icons/person-fill-icon.png")}
                        />
                        <Text className="text-center text-white text-3xl font-semibold">
                          {userInfo?.userProfile.username}
                        </Text>
                        <Text className="text-center text-white text-xl pb-7">
                          {userInfo?.userProfile.users_firstname}{" "}
                          {userInfo?.userProfile.users_lastname}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                )
              )}
              <TouchableOpacity
                style={styles.editImageContainer}
                onPress={pickImage}
              >
                <Icon name="image-outline" size={30} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.formContainer}>
              <View className="mb-4">
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Firstname</Text>
                  <TextInput
                    placeholder="Firstname"
                    value={firstname}
                    numberOfLines={1}
                    maxLength={40}
                    onChangeText={setFirstname}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Lastname</Text>
                  <TextInput
                    placeholder="Lastname"
                    value={lastname}
                    numberOfLines={1}
                    maxLength={40}
                    onChangeText={setLastname}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Username</Text>
                  <TextInput
                    placeholder="Username"
                    value={username}
                    className="bg-gray-100 text-gray-800 rounded-xl"
                    style={styles.inputField}
                    numberOfLines={1}
                    maxLength={40}
                    onChangeText={setUsername}
                  />
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Email</Text>
                  <TextInput
                    placeholder="Email"
                    value={email}
                    numberOfLines={1}
                    maxLength={40}
                    onChangeText={setEmail}
                    style={styles.inputField}
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Phone</Text>
                  <TextInput
                    placeholder="Phone Number"
                    value={phone}
                    keyboardType={"phone-pad"}
                    numberOfLines={1}
                    maxLength={40}
                    onChangeText={setPhone}
                    style={styles.inputField}
                  />
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Birthday</Text>
                  <TouchableOpacity
                    onPress={handleOpenDatePicker}
                    style={styles.datePickerButton} // เพิ่มสไตล์ให้ดูเป็นช่องกรอก
                  >
                    <View style={styles.dateContainer}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.datePickerText,
                          {
                            color: dateOfBirth ? "#000" : "#777777",
                            flex: 1,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {dateOfBirth
                          ? formatDate(dateOfBirth, true, false, false, "day")
                              .date
                          : "DD"}
                      </Text>
                      <Text style={{ flex: 0.1, textAlign: "center" }}>/</Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.datePickerText,
                          {
                            color: dateOfBirth ? "#000" : "#777777",
                            flex: 1,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {dateOfBirth
                          ? formatDate(dateOfBirth, true, false, false, "month")
                              .date
                          : "MM"}
                      </Text>
                      <Text style={{ flex: 0.1, textAlign: "center" }}>/</Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.datePickerText,
                          {
                            color: dateOfBirth ? "#000" : "#777777",
                            flex: 1,
                            textAlign: "center",
                          },
                        ]}
                      >
                        {dateOfBirth
                          ? formatDate(dateOfBirth, true, false, false, "year")
                              .date
                          : "YYYY"}
                      </Text>
                    </View>
                    <View style={styles.IconContainer}>
                      <Icon name="calendar-outline" size={24} color="#000" />
                    </View>
                  </TouchableOpacity>
                </View>
                <Modal animationType="slide" transparent={true} visible={open}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Datepicker
                        date={dateOfBirth}
                        setDate={handleChangeDate}
                        disabledClear={true}
                      />
                      <TouchableOpacity
                        onPress={() => handleOpenDatePicker()}
                        className="mt-3"
                      >
                        <Text style={styles.closeButtonModal}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Gender</Text>
                  <View style={styles.checkboxWrapper}>
                    {genderOptions.map((gender, index) => (
                      <View key={index} style={styles.checkboxContainer}>
                        <BouncyCheckbox
                          size={22}
                          fillColor="#D71515"
                          unFillColor="#FFFFFF"
                          iconStyle={{ borderColor: "#D71515" }}
                          bounceEffectIn={0.9}
                          bounceEffectOut={1}
                          bounceVelocityIn={0.5}
                          bounceVelocityOut={0.3}
                          bouncinessIn={0.5}
                          bouncinessOut={0.5}
                          text={gender} // ใช้ {} แทน ''
                          isChecked={userGender === gender}
                          onPress={() => setUserGender(gender)}
                          textStyle={{
                            fontFamily: "Poppins-Regular",
                            textDecorationLine: "none",
                            padding: 0,
                            color: "#000000",
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.formBoxContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditSocialMedia")}
                    style={styles.socialMediaContainer}
                  >
                    <Text style={styles.fieldName}>Social Media</Text>
                    <Icon
                      name="chevron-forward-outline"
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="bg-primary p-3 rounded-lg items-center"
              >
                <Text className="text-white font-bold">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  modalHeader: {
    width: "100%",
    height: 500,
  },
  modalHeaderNoImage: {
    width: "100%",
    height: 500,
    backgroundColor: "#acacac",
  },
  systemImage: {
    position: "absolute",
    resizeMode: "cover",
  },
  googleImage: {
    alignItems: "center",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    bottom: 0,
    marginBottom: 0,
  },
  linearBackground: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    paddingTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  formBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 0,
    borderRadius: 20,
    marginBottom: 10,
  },
  fieldName: {
    fontFamily: "Poppins-Regular",
    fontSize: wp("3.5%"),
    color: "#555",
    includeFontPadding: false,
    paddingHorizontal: 8,
    flex: 1, // ให้ fieldName กว้างกว่า inputField
  },
  inputField: {
    fontSize: wp("3.5%"),
    padding: 15,
    paddingVertical: wp("3%"),
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    flex: 2.5,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  datePickerButton: {
    padding: 14,
    paddingBottom: 8,
    borderRadius: 10,
    justifyContent: "center",
    flex: 2.5,
    flexDirection: "row",
    borderBottomColor: "#A9A9A9",
    borderBottomWidth: 1,
  },
  datePickerText: {
    fontSize: wp("3.4%"),
    padding: 1,
    includeFontPadding: false,
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    width: wp("32%"), // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
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
  },
});
