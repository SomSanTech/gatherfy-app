import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import CustomButton from "@/components/CustomButton";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "@/app/context/AuthContext";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { genderOptions } from "@/utils/genderOptions";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Datepicker from "@/components/Datepicker";
import formatDate from "@/utils/formatDate";
import { backToIndex } from "@/composables/backToIndex";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "@/constants/Colors";

const SignUp = () => {
  const navigation = useNavigation();
  const firstnameRef = useRef<TextInput>(null);
  const lastnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState("Attendee");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined); // เริ่มต้นเป็น undefined
  const [userGender, setUserGender] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const { onRegister, onLogin } = useAuth();

  const handleOpenDatePicker = () => {
    setOpen(!open);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Must include at least one uppercase letter (A–Z).");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must include at least one lowercase letter (a–z).");
    }
    if (!/\d/.test(password)) {
      errors.push("Must include at least one number (0–9).");
    }
    if (!/[@#$%^&+=!]/.test(password)) {
      errors.push(
        "Must include at least one special character (@, #, $, %, &, +, =, etc.)."
      );
    }

    return errors;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    let errors = "";
    if (password !== confirmPassword) {
      errors = "Password and confirm password do not match.";
    }
    setIsLoading(false);
    return errors;
  };

  const validateFields = () => {
    if (
      !username ||
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !dateOfBirth ||
      !userGender ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all the fields.");
      setIsLoading(false);
      return false;
    }
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match.");
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordErrors(validatePassword(text)); // ตรวจสอบข้อผิดพลาดของรหัสผ่าน
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordErrors(validateConfirmPassword(text)); // ตรวจสอบข้อผิดพลาดของรหัสผ่าน
  };

  const onSignUpPress = async () => {
    setIsLoading(true);
    if (!validateFields()) {
      return;
    }

    const passwordValidationErrors = validatePassword(password);
    const confirmPasswordValidationErrors =
      validateConfirmPassword(confirmPassword);

    if (passwordValidationErrors.length > 0) {
      alert(passwordValidationErrors.join("\n")); // แจ้งเตือนข้อผิดพลาดที่ไม่ผ่าน
      setIsLoading(false);
      return;
    }

    if (confirmPasswordValidationErrors !== "") {
      alert(confirmPasswordValidationErrors); // แจ้งเตือนข้อผิดพลาดที่ไม่ผ่าน
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format. Please enter a valid email.");
      setIsLoading(false);
      return;
    }

    const result = await onRegister!(
      userRole.trim(),
      username.trim(),
      firstname.trim(),
      lastname.trim(),
      email.trim(),
      phone.trim(),
      dateOfBirth,
      userGender,
      password.trim()
    );

    if (result.error) {
      setIsLoading(false);
      setErrorMsg(result.msg); // แสดงข้อความ error ถ้ามี
    } else {
      setIsLoading(false);
      alert("Create Account Success");
      setIsCreated(true);
      (navigation as any).navigate("signIn");
    }
  };

  const handleChangeDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  > = (dateOfBirth) => {
    setDateOfBirth(dateOfBirth);
    handleOpenDatePicker();
  };

  return (
    <View className="flex-1 bg-gray-100 pt-2">
      <SafeAreaView edges={["top"]} className="flex-1 pt-2">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={backToIndex}
            className="bg-primary p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <Icon name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text
            style={styles.headerText}
            className="text-center align-middle font-Poppins-Bold"
          >
            Create Account
          </Text>
          <Text className="w-12"></Text>
        </View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          className="flex-1 bg-white px-8 pt-0 mt-5 "
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? hp("18%") : 0}
          >
            <TouchableWithoutFeedback>
              <ScrollView
                contentContainerStyle={{ flexGrow: 4 }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View className="form space-y-2 gap-4 pt-8 pb-16">
                  <View className="flex-row justify-center space-x-2">
                    <View className="flex-1">
                      <TouchableOpacity
                        onPress={() => setUserRole("Attendee")}
                        className="bg-primary rounded-xl justify-center items-center p-5"
                        style={{
                          backgroundColor:
                            userRole === "Attendee" ? Colors.primary : "#ffffff",
                          borderWidth: 1,
                          borderColor: userRole === "Attendee" ? Colors.primary : "#cccccc",
                        }}
                      >
                        <Text
                          className="text-center"
                          style={[
                            styles.RoleText,
                            {
                              color:
                                userRole === "Attendee" ? "#ffffff" : "#000000",
                            },
                          ]}
                        >
                          Attendee
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.roleDescription}>
                        For users who want to explore and join existing events.
                      </Text>
                    </View>
                    <View className="flex-1">
                      <TouchableOpacity
                        onPress={() => setUserRole("Organizer")}
                        className="bg-primary rounded-xl justify-center items-center p-5"
                        style={{
                          backgroundColor:
                            userRole === "Organizer" ? Colors.primary : "#ffffff",
                          borderWidth: 1,
                          borderColor:
                            userRole === "Organizer" ? Colors.primary : "#cccccc",
                        }}
                      >
                        <Text
                          className="text-center"
                          style={[
                            styles.RoleText,
                            {
                              color:
                                userRole === "Organizer"
                                  ? "#ffffff"
                                  : "#000000",
                            },
                          ]}
                        >
                          Organizer
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.roleDescription}>
                        For users who want to manage their own events.
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.topicField} className="text-sm">
                      Username
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      value={username}
                      onChangeText={setUsername}
                      className="w-100 p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                      placeholder="Enter Your Username"
                      returnKeyType="next"
                      keyboardType="email-address"
                      multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                      numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                      textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                      onSubmitEditing={() => firstnameRef.current?.focus()}
                    />
                  </View>
                  <View className="flex flex-row space-x-2">
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Firstname
                      </Text>
                      <TextInput
                        ref={firstnameRef}
                        style={styles.inputField}
                        value={firstname}
                        onChangeText={setFirstname}
                        className="w-full p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                        placeholder="Firstname"
                        returnKeyType="next"
                        multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                        numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                        textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                        onSubmitEditing={() => lastnameRef.current?.focus()}
                      />
                    </View>
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Lastname
                      </Text>
                      <TextInput
                        ref={lastnameRef}
                        style={styles.inputField}
                        value={lastname}
                        onChangeText={setLastname}
                        className="w-full p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                        placeholder="Lastname"
                        returnKeyType="next"
                        multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                        numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                        textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                        onSubmitEditing={() => emailRef.current?.focus()}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={styles.topicField} className="text-sm">
                      Email
                    </Text>
                    <TextInput
                      ref={emailRef}
                      style={styles.inputField}
                      value={email}
                      onChangeText={setEmail}
                      className="w-100 p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                      placeholder="eg. gatherfy@example.com"
                      returnKeyType="next"
                      keyboardType="email-address"
                      onSubmitEditing={() => phoneRef.current?.focus()}
                      multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                      numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                      textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                    />
                  </View>
                  <View className="flex flex-row space-x-2">
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Phone
                      </Text>
                      <TextInput
                        ref={phoneRef}
                        style={styles.inputField}
                        value={phone}
                        onChangeText={setPhone}
                        className=" p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                        placeholder="Enter your phone number"
                        returnKeyType="next"
                        keyboardType="phone-pad"
                        multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                        numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                        textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                      />
                    </View>
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Date of Birth
                      </Text>
                      <TouchableOpacity
                        onPress={handleOpenDatePicker}
                        className="bg-gray-100"
                        style={styles.datePickerButton} // เพิ่มสไตล์ให้ดูเป็นช่องกรอก
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.datePickerText,
                            { color: dateOfBirth ? "#000" : "#777777" },
                          ]}
                        >
                          {dateOfBirth
                            ? formatDate(dateOfBirth, true, false, false).date
                            : "DD/MM/YYYY"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={open}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <Datepicker
                          date={dateOfBirth}
                          setDate={handleChangeDate}
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
                  <View>
                    <Text className="mt-3 text-center text-lg font-Poppins-Regular">
                      Gender
                    </Text>
                    <View style={styles.checkboxWrapper}>
                      {genderOptions.map((gender, index) => (
                        <View key={index} style={styles.checkboxContainer}>
                          <BouncyCheckbox
                            size={25}
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
                  <View>
                    <Text style={styles.topicField}>Password</Text>
                    <View style={{ position: "relative" }}>
                      <TextInput
                        ref={passwordRef}
                        className="p-4 pr-14 bg-gray-100 text-gray-800 rounded-xl"
                        style={[
                          styles.inputField,
                          {
                            borderBottomWidth: password.length > 0 ? 1 : 0,
                            borderColor:
                              passwordErrors.length > 0 ? "red" : "green",
                          },
                        ]}
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!isPasswordVisible}
                        placeholder="Enter Your password"
                        textContentType="newPassword" // บอก iOS ว่าเป็นรหัสผ่านใหม่
                        returnKeyType="next"
                        multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                        numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                        textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                        onSubmitEditing={() =>
                          confirmPasswordRef.current?.focus()
                        }
                      />
                      <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-5 top-[30%]"
                      >
                        <Icon
                          name={isPasswordVisible ? "eye-off" : "eye"}
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                    </View>
                    {passwordErrors.map((error, index) => (
                      <Text key={index} style={{ color: "red", marginTop: 4 }}>
                        {error}
                      </Text>
                    ))}
                  </View>
                  <View className="mb-3">
                    <Text style={styles.topicField}>Confirm Password</Text>
                    <View style={{ position: "relative" }}>
                      <TextInput
                        ref={confirmPasswordRef}
                        className="p-4 pr-14 bg-gray-100 text-gray-800 rounded-xl"
                        style={[
                          styles.inputField,
                          {
                            borderBottomWidth:
                              confirmPassword.length > 0 ? 1 : 0,
                            borderColor:
                              confirmPasswordErrors.length > 0
                                ? "red"
                                : "green",
                          },
                        ]}
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        secureTextEntry={!isConfirmPasswordVisible}
                        placeholder="Confirm your password"
                        multiline={false} // ป้องกันการพิมพ์หลายบรรทัด
                        numberOfLines={1} // กำหนดให้มีเพียง 1 บรรทัด
                        textAlignVertical="center" // จัดให้อยู่ตรงกลางแนวตั้ง
                        returnKeyType="done"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                        className="absolute right-5 top-[30%]"
                      >
                        <Icon
                          name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                    </View>
                    {confirmPassword.length > 0 &&
                      confirmPasswordErrors.length > 0 && (
                        <Text style={{ color: "red", marginTop: 10 }}>
                          {confirmPasswordErrors}
                        </Text>
                      )}
                  </View>
                  <View>
                    <CustomButton
                      title={isCreated ? "Waiting..." : "Sign Up"}
                      handlePress={onSignUpPress}
                      containerStyles={{}}
                      textStyle={[styles.inputField, { fontSize: wp("4%") }]}
                      classNameContainerStyle="w-full py-3 bg-primary rounded-xl flex-row justify-center items-center"
                      classNameTextStyle="font-Poppins-Bold text-lg text-center text-white"
                      IconComponent={
                        isLoading ? (
                          <ActivityIndicator
                            size="small"
                            color="white"
                            className="mr-5"
                          />
                        ) : isCreated ? (
                          <Icon
                            name="checkmark-circle"
                            size={20}
                            color="white"
                            style={{ marginRight: 20 }}
                          />
                        ) : null
                      }
                    />
                  </View>
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(400).springify()}
                  >
                    <Text className="text-gray-600 mt-1 text-center font-Poppins-Light">
                      Already have an account?{" "}
                      <Link href={"/signIn"}>
                        <Text className="font-Poppins-Bold">Log In</Text>
                      </Link>
                    </Text>
                  </Animated.View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: wp("5.5%"), // ขนาด font เป็น 5% ของหน้าจอ
    color: "#000000",
    fontFamily: "Poppins-Bold",
  },
  topicField: {
    color: "#000000",
    marginBottom: 12,
    fontFamily: "Poppins-Regular",
  },
  RoleText: {
    fontSize: wp("3.1%"),
    includeFontPadding: false,
    fontFamily: "Poppins-Bold",
  },
  roleDescription: {
    fontSize: wp("2.8%"),
    color: "#000000",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  inputField: {
    fontSize: wp("3.1%"), // ขนาด font เป็น 4% ของหน้าจอ
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  datePickerButton: {
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: wp("3.1%"),
    padding: 2,
    includeFontPadding: false,
    fontFamily: "Poppins-Regular",
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
    height: hp("60%"), 
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
  closeButtonModal: {
    fontSize: wp("3.5%"), // ขนาด font เป็น 4% ของหน้าจอ
    color: "#000000",
    fontFamily: "Poppins-Bold",
  },
  checkboxWrapper: {
    flexDirection: "row", // เรียงแบบ row
    flexWrap: "wrap", // ให้สามารถขึ้นบรรทัดใหม่ได้
    justifyContent: "space-between", // จัดให้ช่องว่างระหว่าง Checkbox เท่ากัน
    alignItems: "center", // จัดให้อยู่กึ่งกลาง
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 0,
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },

  checkboxContainer: {
    width: "48%", // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
    marginBottom: 18,
    borderWidth: 0,
  },
});

export default SignUp;
