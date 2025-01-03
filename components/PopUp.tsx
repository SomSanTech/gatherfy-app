import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useFetchRegistration } from "@/composables/useFetchRegistration";

type PopupProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  eventName?: string;
  eventLocation?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  eventId: string;
  user: {
    userId: number;
    firstname: string;
    lastname: string;
    username: string;
    gender: string;
    email: string;
    phone: string;
    role: string;
    password: string;
  };
};

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  title,
  eventName,
  eventLocation,
  startDate,
  endDate,
  startTime,
  endTime,
  user,
  eventId,
}) => {
  const [password, setPassword] = useState<string>(""); // State สำหรับเก็บ password
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true); // State สำหรับตรวจสอบ password
  const [errorText, setErrorText] = useState<string>(""); // State สำหรับเก็บข้อความแสดง error
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // สถานะการแสดงรหัสผ่าน

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCancel = () => {
    setIsPasswordValid(true);
    setPassword("");
    setErrorText("");
    setIsPasswordVisible(false);
    onClose();
  }

  const handleSubmit = async () => {
    // สร้างค่าที่ต้องการในออบเจกต์ชั่วคราว
    const registrationBody = {
      eventId: eventId,
      userId: user.userId,
      status: "Awaiting Check-in",
    };

    // ตรวจสอบ password ก่อน
    if (password === "") {
      setErrorText("Please enter your password.");
      setIsPasswordValid(false);
      return;
    }

    if (user.password !== password) {
      setErrorText("Password is incorrect.");
      setIsPasswordValid(false);
      return;
    } else {
      setErrorText("");
      setIsPasswordValid(true);
    }
    try {
      const response = await useFetchRegistration(registrationBody);
      setPassword("");
      if (response?.status === "Awaiting Check-in") {
        Alert.alert("Success", "Registration successful.");
        onClose();
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          {title === "Registration" ? (
            <View>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={styles.title}>{title}</Text>
                <View>
                  <Text style={styles.eventName}>{eventName}</Text>
                </View>
                <View className="mb-2 flex-row items-center">
                  <Icon name="calendar-outline" size={19} color="#000000" />
                  <Text className="ml-2" style={styles.eventDetail}>
                    {startDate}{" "}
                    {endDate ? (
                      <Text style={styles.eventDetail}>- {endDate}</Text>
                    ) : (
                      <Text style={styles.eventDetail}>No end date</Text>
                    )}
                  </Text>
                </View>
                <View className="mb-2 flex-row items-center">
                  <Icon name="time-outline" size={19} color="#000000" />
                  <Text style={styles.eventDetail}>
                    {startTime} - {endTime}
                  </Text>
                </View>
                <View className="mb-2 flex-row items-center">
                  <Icon name="map-outline" size={20} color="#000000" />
                  <Text style={styles.eventDetail}>{eventLocation}</Text>
                </View>
                {user && (
                  <View className="flex-row items-center">
                    <Icon
                      name="person-circle-outline"
                      size={20}
                      color="#000000"
                    />
                    <Text style={styles.userName}>
                      <Text>{user.username} </Text>
                      <Text style={styles.email}>{user.email}</Text>
                    </Text>
                  </View>
                )}
                <View className="mt-5">
                  <Text className="font-Poppins-Bold text-lg">
                    To confirm, Enter Your Password
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!isPasswordVisible}
                      style={styles.inputPassword}
            
                      numberOfLines={2}
                      maxLength={30}
                    />
                    {/* ปุ่ม Show/Hide Password */}
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      <Icon
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={24}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                  {!isPasswordValid ? (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {" "}
                      {errorText}{" "}
                    </Text>
                  ) : (
                    ""
                  )}
                </View>
              </View>

              <TouchableHighlight
                style={styles.submitTextContainer}
                onPress={handleSubmit}
                underlayColor="#DDDDDD"
              >
                <Text style={styles.submitText}>Confirm Registration</Text>
              </TouchableHighlight>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>{title || "Default Title"}</Text>
              <Text style={styles.message}>
                {eventName || "Default Event Name"}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.popupContainer2}>
          <TouchableHighlight
            style={styles.cancelTextContainer}
            onPress={handleCancel}
            underlayColor="#DDDDDD"
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingTop: 20,
  },
  popupContainer2: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    padding: 0,
  },
  submitTextContainer: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 15,
    marginTop: 20,
    borderTopWidth: 0.3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cancelTextContainer: {
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
  },
  submitText: {
    fontSize: 19,
    color: "black",
    fontFamily: "Poppins-SemiBold",
    textDecorationLine: "underline",
  },
  cancelText: {
    fontSize: 18,
    color: "black",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    padding: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
  eventName: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  eventDetail: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
  },
  inputContainer: {
    position: "relative", // ใช้สำหรับจัดตำแหน่งของไอคอน
  },
  inputPassword: {
    width: "100%",
    minHeight: 40,
    textAlignVertical: "top",
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    paddingRight: 45, // ปรับระยะห่างของ input กับไอคอน
    marginTop: 10,
    fontFamily: "Poppins-Regular",
  },
  eyeIcon: {
    position: "absolute",
    padding: 10,
    right: 4,
    top: "33%",
    transform: [{ translateY: -8 }], // ปรับตำแหน่งแนวตั้งให้อยู่กลาง
  },
  showPasswordText: {
    color: "#007BFF",
    marginTop: 10,
    fontSize: 16,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  userName: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  email: {
    fontSize: 16,
    paddingLeft: 20,
    fontFamily: "Poppins-Regular",
  },
});

export default Popup;
