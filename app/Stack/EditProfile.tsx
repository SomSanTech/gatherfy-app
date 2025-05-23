import { Fragment, useEffect, useState } from "react";
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
import { useFetchDelete, useFetchUpload } from "@/composables/useFetchFile";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator } from "react-native-paper";

const EditProfile = () => {
  const { updateProfile } = useAuth();
  const { navigateToGoBack } = useNavigateToGoBack();
  const navigation = useNavigation<any>();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);
  const [userGender, setUserGender] = useState<string | undefined>(undefined);

  const [selectedImage, setSelectedImage] = useState<
    ImagePicker.ImagePickerAsset | undefined
  >(undefined);
  const [currentImage, setCurrentImage] = useState<string | undefined>(
    undefined
  );

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("my-jwt");
      const user = await fetchUserProfile(token, "/v1/profile", "GET");

      if (!user) {
        throw new Error("User profile not found.");
      }

      setUserInfo(user);
      setUsername(user.username || "");
      setFirstname(user.users_firstname || "");
      setLastname(user.users_lastname || "");
      setPhone(user.users_phone || "");
      setCurrentImage(user.users_image || "");
      setDateOfBirth(user.users_birthday || "");
      setEmail(user.users_email || "");
      setUserGender(user.users_gender || "");
      setIsLoading(false);
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

  const openImagePicker = async (type: "camera" | "gallery") => {
    let result: ImagePicker.ImagePickerResult;

    if (type === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.5,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.5,
      });
    }

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
    setModalVisible(false);
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const missingFields = [];

      // ตรวจสอบค่าที่จำเป็น
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
          `Please fill ${missingFields.join(", ")}`
        );
        setIsLoading(false);
        return;
      }

      // ตรวจสอบรูปแบบของอีเมล
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email && !emailRegex.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
      }

      let newImageFileName = currentImage; // ใช้ภาพเดิมหากไม่มีการเลือกภาพใหม่

      // ถ้ามีการเลือกภาพใหม่
      if (selectedImage) {
        const token = await SecureStore.getItemAsync("my-jwt");

        // ลบรูปเก่าถ้ามี
        if (currentImage) {
          const currentImageName = currentImage.split("/").pop(); // ดึงชื่อไฟล์จาก URL
          await useFetchDelete(
            `v1/files/delete/${currentImageName}?bucket=profiles`,
            token
          );
        }

        // อัปโหลดรูปใหม่
        const uploadResponse = await useFetchUpload(
          "v1/files/upload",
          selectedImage,
          "profiles", // bucket ที่ต้องการเก็บไฟล์
          token
        );

        if (!uploadResponse || uploadResponse.error) {
          console.error("Upload failed:", uploadResponse?.error);
          Alert.alert("Upload Failed", "Failed to upload profile image.");
          setIsLoading(false);
          return;
        }

        // ใช้ชื่อไฟล์ใหม่จาก API
        newImageFileName = uploadResponse.fileName;
      }

      // ส่งข้อมูลไปอัปเดต
      if (updateProfile) {
        if (selectedImage) {
          const token = await SecureStore.getItemAsync("my-jwt");
          console.log(token);
          console.log("with selected");

          const result = await updateProfile(
            username,
            firstname,
            lastname,
            email,
            phone,
            dateOfBirth,
            userGender || "",
            newImageFileName || "" // ตรวจสอบให้เป็น string เสมอ
          );
          if (result.error) {
            setIsLoading(false);
            let errorMessage = "Something went wrong.";
            if (result.status == 413) {
              errorMessage =
                "File size too large. Please select a smaller image.";
            } else if (result.msg) {
              errorMessage = result.msg;
            }

            Alert.alert("Error", errorMessage);
          } else {
            console.log(
              "Profile updated successfully with image:",
              newImageFileName
            );
            Alert.alert("Success", "Profile updated successfully");
            setIsLoading(false);
            setCurrentImage(newImageFileName);
          }
        } else {
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
            setIsLoading(false);
            Alert.alert("Error", result.msg);
          } else {
            setIsLoading(false);
            Alert.alert("Success", "Profile updated successfully");
          }
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Something went wrong while updating profile.");
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={navigateToGoBack}
              className="flex-row items-center"
            >
              <Icon name="chevron-back" size={26} color="#000000" />
              <Text
                className="text-xl font-Poppins-SemiBold text-center ml-3"
                style={styles.headerText}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-gray-200"
              >
                <View style={styles.imageProfile}>
                  {currentImage ? (
                    <>
                      {selectedImage?.uri || currentImage ? (
                        <ImageBackground
                          className="w-full h-full"
                          style={styles.systemImage}
                          source={{
                            uri: selectedImage?.uri || currentImage,
                          }}
                        >
                          <LinearGradient
                            colors={[
                              "transparent",
                              "rgba(255,255,255,0)",
                              "rgba(0,0,0,0.65)",
                            ]}
                            locations={
                              Platform.OS === "android"
                                ? [0, 0.4, 0.85]
                                : [0.5, 0, 1]
                            }
                            style={styles.linearBackground}
                          ></LinearGradient>
                        </ImageBackground>
                      ) : (
                        <Image
                          source={require("@/assets/icons/user-edit-icon.png")}
                          className="opacity-30 w-28 h-28 m-auto"
                        />
                      )}
                    </>
                  ) : (
                    <Image
                      source={require("@/assets/icons/user-edit-icon.png")}
                      className="opacity-30 w-28 h-28 m-auto"
                    />
                  )}
                </View>

                <TouchableOpacity
                  style={styles.editImageContainer}
                  onPress={() => setModalVisible(true)}
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
                      editable={false}
                      placeholder="Email"
                      value={email}
                      selectTextOnFocus={false}
                      numberOfLines={1}
                      maxLength={40}
                      onChangeText={setEmail}
                      style={styles.disabledInputField}
                      keyboardType="email-address"
                      autoCapitalize="none"
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
                        <Text style={{ flex: 0.1, textAlign: "center" }}>
                          /
                        </Text>
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
                            ? formatDate(
                                dateOfBirth,
                                true,
                                false,
                                false,
                                "month"
                              ).date
                            : "MM"}
                        </Text>
                        <Text style={{ flex: 0.1, textAlign: "center" }}>
                          /
                        </Text>
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
                            ? formatDate(
                                dateOfBirth,
                                true,
                                false,
                                false,
                                "year"
                              ).date
                            : "YYYY"}
                        </Text>
                      </View>
                      <View style={styles.IconContainer}>
                        <Icon name="calendar-outline" size={24} color="#000" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Modal animationType="fade" transparent={true} visible={open}>
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
                            text={gender}
                            isChecked={userGender === gender}
                            onPress={() => {
                              if (userGender !== gender) {
                                setUserGender(gender);
                              } else {
                                setUserGender("");
                              }
                            }}
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
                  className={`bg-primary p-3 rounded-lg items-center justify-center flex-row ${
                    Platform.OS === "ios" ? "mb-7" : "mb-2"
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color="white"
                      className="mr-5"
                    />
                  ) : null}
                  <Text className="text-white" style={styles.buttonSave}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose an option</Text>
              <View style={styles.modalContentList}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => openImagePicker("camera")}
                >
                  <Icon
                    name="camera-outline"
                    size={30}
                    color="#000"
                    style={{ marginBottom: 5 }}
                  />
                  <Text style={styles.optionText}>Take a Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => openImagePicker("gallery")}
                >
                  <Icon
                    name="images-outline"
                    size={30}
                    color="#000"
                    style={{ marginBottom: 5 }}
                  />
                  <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Fragment>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  imageProfile: {
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
    fontSize: wp("3.2%"),
    color: "#555",
    includeFontPadding: false,
    paddingHorizontal: 8,
    flex: 1, // ให้ fieldName กว้างกว่า inputField
  },
  inputField: {
    fontSize: wp("3.3%"),
    padding: 15,
    paddingVertical: wp("3%"),
    backgroundColor: "#F6F6F6",
    borderRadius: 15,
    flex: 2.4,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  disabledInputField: {
    fontSize: wp("3%"),
    padding: 15,
    paddingVertical: wp("3%"),
    backgroundColor: "#d4d4d4",
    borderRadius: 15,
    flex: 2.5,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
    color: "#7e7e7e",
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
    fontSize: wp(4.2),
    includeFontPadding: false,
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
    padding: 20,
    paddingBottom: 10,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    includeFontPadding: false,
    textAlign: "center",
    marginBottom: 10,
  },
  modalContentList: {
    flexDirection: "row", // จัดเรียงปุ่มในแนวนอน
    justifyContent: "space-around", // จัดระยะห่างระหว่างปุ่ม
    width: "100%",
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  optionButtonContainer: {
    flexDirection: "row", // จัดเรียงปุ่มในแนวนอน
    justifyContent: "space-around", // จัดระยะห่างระหว่างปุ่ม
    width: "100%", // ให้ container กว้าง 100% ของหน้าจอ
  },
  optionButton: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    flex: 1, // ใช้ flex เพื่อให้ปุ่มขยายได้
    marginHorizontal: 5, // ให้มีช่องว่างระหว่างปุ่ม
    marginTop: 10, // ให้มีช่องว่างระหว่างปุ่ม
    justifyContent: "center", // จัดให้ข้อความอยู่ตรงกลาง
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  cancelButton: {
    padding: 15,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    color: Colors.black,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  buttonSave: {
    backgroundColor: "#D71515",
    borderRadius: 10,
    paddingVertical: 3,
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
  },
});
