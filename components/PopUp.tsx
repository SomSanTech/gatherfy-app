import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableHighlight,
  Animated,
  Platform,
} from "react-native";
import { useFetchRegistration } from "@/composables/useFetchRegistration";
import * as SecureStore from "expo-secure-store";
import Calendar from "../assets/icons/Calendar.svg"
import Location from "../assets/icons/Location.svg"
import Time from "../assets/icons/Time.svg"
import { Dropdown } from "react-native-element-dropdown";

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
    users_id: number;
    username: string;
    users_email: string;
    password: string;
  };
  setConfirmRegister: (value: boolean) => void;
  registrationDateList: { label: string; value: string }[];
  defaultValue: { label: string; value: string }
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
  setConfirmRegister,
  registrationDateList,
  defaultValue
}) => {
  const [password, setPassword] = useState<string>(""); // State สำหรับเก็บ password
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true); // State สำหรับตรวจสอบ password
  const [errorText, setErrorText] = useState<string>(""); // State สำหรับเก็บข้อความแสดง error
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // สถานะการแสดงรหัสผ่าน
  const [fadeAnim] = useState(new Animated.Value(0)); // ค่าเริ่มต้นที่ 0 คือ ซ่อนโมดัล
  const [selectedDate, setSelectedDate] = useState<{ label: string; value: string }>(); // สถานะการแสดงรหัสผ่าน
  const [isSelectedDate, setIsSelectedDate] = useState(false); // สถานะการแสดงรหัสผ่าน


  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCancel = () => {
    setIsPasswordValid(true);
    setPassword("");
    setErrorText("");
    setIsPasswordVisible(false);
    setIsSelectedDate(false)

    // เริ่มแอนิเมชันให้โมดัลค่อยๆ จางไป
    Animated.timing(fadeAnim, {
      toValue: 0, // ทำให้ opacity เป็น 0
      duration: 200, // ระยะเวลาการแอนิเมชัน
      useNativeDriver: true,
    }).start();

    // เพิ่มดีเลย์ในการปิดโมดัลหลังจากแอนิเมชันเสร็จสิ้น
    setTimeout(() => {
      onClose(); // ปิดโมดัลจริง ๆ
    }, 200); // ดีเลย์ 300ms ให้แอนิเมชันเสร็จสิ้นก่อน
  };

  const handleSubmit = async () => {
    // สร้างค่าที่ต้องการในออบเจกต์ชั่วคราว
    if(isSelectedDate){
      const registrationBody = {
        eventId: eventId,
        regisDate: selectedDate?.value
      };
      console.log(registrationBody)
      const token = await SecureStore.getItemAsync("my-jwt");  
      try {
        const response = await useFetchRegistration(registrationBody, token);
        if (response?.status === "Awaiting Check-in") {
          Alert.alert("Success", "Registration successful.");
          onClose();
        }
        setConfirmRegister(true);
      } catch (error) {
        console.error("Error during registration:", error);
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    }
  };

  const handleSelectedDate = (dateItem: any) => {
    setSelectedDate(dateItem)
    setIsSelectedDate(true)
  }

  useEffect(() => {
    if (visible) {
      // เมื่อโมดัลเปิด
      Animated.timing(fadeAnim, {
        toValue: 1, // ทำให้โมดัลแสดง (ค่าของ opacity)
        duration: 230, // ระยะเวลาการแสดงแอนิเมชัน
        useNativeDriver: true,
      }).start();
    } else {
      // เมื่อโมดัลปิด
      Animated.timing(fadeAnim, {
        toValue: 0, // ทำให้โมดัลหายไป (ค่าของ opacity)
        duration: 200,
        useNativeDriver: true,
      }).start();

      // เพิ่มดีเลย์ในการปิดโมดัลหลังจากแอนิเมชันจบ
      setTimeout(() => {
        onClose();
      }, 200); // รอแอนิเมชัน 300ms ก่อนที่จะปิดโมดัล
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.popupContainer}>
          {title === "Reserve your seat now" ? (
            <View>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={styles.title}>{title}</Text>
                <View>
                  <Text style={styles.eventName}>{eventName}</Text>
                </View>
                <View className="mb-2 flex-row items-center">
                  <Calendar width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#000" strokeWidth={10} />
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
                  <Time width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#000" strokeWidth={10} />
                  <Text style={styles.eventDetail}>
                    {startTime} - {endTime}
                  </Text>
                </View>
                <View className="mb-2 flex-row items-start">
                  <Location width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#000" strokeWidth={10} style={{marginTop:4}} />
                  <Text style={styles.eventDetail}>{eventLocation}</Text>
                </View>
                <Text className="my-2 font-Poppins-Base text-xs">Please confirm a registration date to continue.</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={registrationDateList}
                  labelField="label"
                  valueField="value"
                  onChange={(item) => handleSelectedDate(item)}
                  placeholder={defaultValue?.label}
                  placeholderStyle={{
                    color: "gray",
                    includeFontPadding: false,
                    padding: 4,
                    fontSize: Platform.OS === "ios" ? 16 : 14,
                    fontFamily: "Poppins-Regular",
                  }}
                  selectedTextStyle={{
                    color: "black",
                    fontFamily: "Poppins-Base",
                    includeFontPadding: false,
                    fontSize: Platform.OS === "ios" ? 16 : 14
                  }}
                  itemTextStyle={{
                    color: "black",
                    fontFamily: "Poppins-Regular",
                    // lineHeight: 18,
                    includeFontPadding: false,
                    fontSize: Platform.OS === "ios" ? 16 : 14
                  }}
                  selectedTextProps={{ numberOfLines: 1 }}
                  itemContainerStyle={{ backgroundColor: "white" }}
                  containerStyle={{ borderRadius: 10, maxHeight: 180, overflow: "hidden" }}
                  renderLeftIcon={() => (<Calendar width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#4B5563" style={{ marginRight: 6 }} />)}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.title}>{title || "Default Title"}</Text>
              <Text style={styles.message}>
                {eventName || "Default Event Name"}
              </Text>
            </View>
          )}
          <View className="flex-row self-center justify-between bg-transparent mt-4 w-[90%]">
            <View style={{ width: "49%" }}>
              <TouchableHighlight
                style={styles.cancelTextContainer}
                onPress={handleCancel}
                underlayColor="#DDDDDD"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableHighlight>
            </View>
            <View style={{ width: "49%" }}>
              <TouchableHighlight
                style={[styles.submitTextContainer, isSelectedDate ? "" : {opacity:0.8}]}
                onPress={handleSubmit}
                underlayColor="#DDDDDD"
                disabled={ isSelectedDate ? false : true}
              >
                <Text style={styles.submitText}>Confirm</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Animated.View>
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
    paddingVertical: 30,
  },
  popupContainer2: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 10,
    padding: 0,
  },
  title: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    marginBottom: 10,
    fontFamily: "Poppins-Regular",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
  eventName: {
    fontSize: Platform.OS === "ios" ? 24 : 20,
    marginBottom: 10,
    fontFamily: "Poppins-SemiBold",
  },
  eventDetail: {
    fontSize: Platform.OS === "ios" ? 16 : 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    includeFontPadding: false
  },
  inputContainer: {
    position: "relative", // ใช้สำหรับจัดตำแหน่งของไอคอน
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
  dropdown: {
    height: 42,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "100%",
    marginVertical: 5
  },
  submitTextContainer: {
    backgroundColor: "#D71515",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#D71515",
    borderWidth: 1,
    includeFontPadding: false,
  },
  submitText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false
  },
  cancelTextContainer: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  cancelText: {
    color: "#626567",
    fontFamily: "Poppins-SemiBold",
  },
});

export default Popup;
