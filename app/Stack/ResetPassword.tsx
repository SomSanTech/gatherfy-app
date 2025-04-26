import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import Icon from "@expo/vector-icons/Ionicons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";

import { SafeAreaView } from "react-native-safe-area-context";
import { resetPassword } from "@/composables/useFetchUserProfile";
import { Colors } from "@/constants/Colors";
import CustomButton from "@/components/CustomButton";

const ResetPassword = () => {
  const { navigateToGoBack } = useNavigateToGoBack();
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmError, setConfirmError] = useState("");

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

  useEffect(() => {
    if (newPassword) {
      setPasswordErrors(validatePassword(newPassword));
    } else {
      setPasswordErrors([]);
    }
  }, [newPassword]);

  useEffect(() => {
    if (confirmPassword && confirmPassword !== newPassword) {
      setConfirmError("New password and confirm password do not match.");
    } else {
      setConfirmError("");
    }
  }, [confirmPassword, newPassword]);

  const handleSavePassword = async () => {
    setIsLoading(true);
    const token = await SecureStore.getItemAsync("my-jwt");

    if (!token) {
      Alert.alert("Error", "Authentication token is missing.");
      return;
    }

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Fields cannot be empty or just spaces.");
      return;
    }

    if (passwordErrors.length > 0 || confirmError) {
      Alert.alert(
        "Invalid Password",
        [...passwordErrors, confirmError].join("\n")
      );
      return;
    }

    const response = await resetPassword(token, "/api/v1/password", "PUT", {
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    if (response.error) {
      Alert.alert("Unsuccess", response.error); // แสดงข้อความจาก responseData.message
      setIsLoading(false);
      return;
    }


    if (response.message === "Password updated successfully!") {
      Alert.alert("Success", response.message); // แสดงข้อความสำเร็จจาก backend
      navigateToGoBack();
      return;
    }
  };

  const isSaveDisabled =
    !currentPassword.trim() ||
    !newPassword.trim() ||
    !confirmPassword.trim() ||
    passwordErrors.length > 0 ||
    !!confirmError;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navigateToGoBack}>
            <Icon name="chevron-back" size={26} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Change Password</Text>
        </View>
        <TouchableWithoutFeedback>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <View className="mb-4">
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Current Password</Text>
                  <TextInput
                    placeholder="Enter current password"
                    value={currentPassword}
                    secureTextEntry={!isCurrentPasswordVisible}
                    numberOfLines={1}
                    onChangeText={setCurrentPassword}
                    style={styles.inputField}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                    }
                    className="absolute right-5 top-[30%]"
                  >
                    <Icon
                      name={isCurrentPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>New Password</Text>
                  <TextInput
                    placeholder="Enter new password"
                    value={newPassword}
                    secureTextEntry={!isNewPasswordVisible}
                    numberOfLines={1}
                    onChangeText={setNewPassword}
                    style={styles.inputField}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setIsNewPasswordVisible(!isNewPasswordVisible)
                    }
                    className="absolute right-5 top-[30%]"
                  >
                    <Icon
                      name={isNewPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {passwordErrors.length > 0 && (
                  <View className="mt-2 mb-4">
                    {passwordErrors.map((error, index) => (
                      <Text key={index} className="text-red-500 text-sm">
                        • {error}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.formBoxContainer}>
                  <Text style={styles.fieldName}>Confirm Password</Text>
                  <TextInput
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    numberOfLines={1}
                    onChangeText={setConfirmPassword}
                    style={styles.inputField}
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
                {confirmError ? (
                  <Text className="text-red-500 text-sm mt-1">
                    {confirmError}
                  </Text>
                ) : null}
              </View>

              <View>
                <CustomButton
                  title="Save Changes"
                  handlePress={handleSavePassword}
                  containerStyles={[
                    styles.saveButton,
                    isSaveDisabled
                      ? styles.saveButtonDisabled
                      : styles.saveButtonEnabled,
                  ]}
                  textStyle={[
                    styles.saveButtonText,
                    isSaveDisabled
                      ? styles.saveButtonTextDisabled
                      : styles.saveButtonTextEnabled,
                  ]}
                  classNameContainerStyle="w-full py-3 bg-primary rounded-xl flex-row justify-center items-center"
                  disabled={isSaveDisabled}
                  IconComponent={
                    isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color="white"
                        className="mr-5"
                      />
                    ) : null
                  }
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
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
  formContainer: {
    padding: 15,
    paddingTop: 30,
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
  saveButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonEnabled: {
    backgroundColor: Colors.primary, // สีหลัก
  },
  saveButtonDisabled: {
    backgroundColor: "#A0A0A0", // สีเทา (ปุ่ม disable)
  },
  saveButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
  saveButtonTextEnabled: {
    color: "#FFFFFF", // สีขาว (ปุ่มปกติ)
  },
  saveButtonTextDisabled: {
    color: "#D3D3D3", // สีเทาอ่อน (ปุ่ม disable)
  },
});
