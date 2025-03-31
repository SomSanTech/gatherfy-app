import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useResendOTP, useSendOTP } from "@/composables/useFetchOTP";

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type AuthStackParamList = {
  OTPScreen: { email: string };
};

type OTPScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "OTPScreen"
>;

const OTPScreen = ({ navigation }: { navigation: OTPScreenNavigationProp }) => {
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const useNavigate = useNavigation();

  const route = useRoute<RouteProp<AuthStackParamList, "OTPScreen">>();
  const email = route.params?.email || ""; // ✅ รับ email ที่ส่งมา

  // const handleConfirm = async (fillOTP: string) => {
  //   if (!fillOTP || !email) {
  //     Alert.alert("Error", "OTP or Email is missing.");
  //     return;
  //   }

  //   console.log("Entered OTP:", fillOTP);
  //   setSending(true);

  //   const response = await useSendOTP(
  //     `/api/v1/verify-otp`,
  //     fillOTP,
  //     email
  //   );

  //   console.log("useSendOTP response:", response);

  //   if (response.success) {
  //     console.log("OTP verification successful:", response.data);
  //     Alert.alert("Success", "OTP verified successfully!");
  //     // ✅ อาจนำทางไปหน้าถัดไป
  //   } else {
  //     console.log("OTP verification failed:", response.message);
  //     Alert.alert("Unsuccess", response.message || "OTP verification failed.");
  //   }

  //   setSending(false);
  // };

  const handleConfirm = async (fillOTP: string) => {
    if (!fillOTP || !email) {
      Alert.alert("Error", "OTP or Email is missing.");
      return;
    }

    console.log("Entered OTP:", fillOTP);
    setSending(true);

    const response = await useSendOTP(`/api/v1/verify-otp`, fillOTP, email);

    console.log("useSendOTP response:", response);

    if (response.success) {
      console.log("OTP verification successful:", response.data);
      (useNavigate as any).reset({
        index: 0, // รีเซ็ต stack ของ navigator
        routes: [{ name: "signIn" }], // ไปที่หน้า signIn
      });
      Alert.alert(response.data, "Please login to continue")
    } else {
      console.log("OTP verification failed:", response.message);
      Alert.alert("Unsuccess", response.message || "OTP verification failed.");
    }

    setSending(false);
  };

  const handleResendOTP = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing.");
      return;
    }

    setSending(true);

    const response = await useResendOTP(`/api/v1/resend-otp`, email);

    if (response.success) {
      console.log("OTP resent successfully:", response.message);
      alert(response.message); // ✅ แสดง "New OTP sent to your email."
    } else {
      console.log("OTP resend failed:", response.message);
      alert(response.message || "OTP resend failed.");
    }

    setSending(false);
  };

  useEffect(() => {
    // ฟังก์ชันนี้จะทำงานเมื่อคอมโพเนนต์ถูกสร้างขึ้น
    console.log(otp);
    return () => {
      // ฟังก์ชันนี้จะทำงานเมื่อคอมโพเนนต์ถูกลบออก
      console.log("OTPScreen unmounted");
    };
  }, [otp]);

  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <OtpInput
          numberOfDigits={6}
          focusColor={Colors.primary}
          autoFocus={false}
          hideStick={false}
          blurOnFilled={true}
          disabled={sending}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFocus={() => console.log("Focused")}
          onBlur={() => console.log("Blurred")}
          onTextChange={setOtp}
          onFilled={(otp) => handleConfirm(otp)}
          textProps={{
            accessibilityRole: "text",
            accessibilityLabel: "OTP digit",
            allowFontScaling: false,
          }}
          theme={{
            containerStyle: styles.pinContainer,
            pinCodeTextStyle: styles.pinCodeText,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleConfirm(otp)}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResendOTP}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    height: "40%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pinContainer: {
    height: "10%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 50,
  },
  pinCodeText: {
    fontSize: 25,
    color: "#000",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    includeFontPadding: false,
  },
  filledPinCodeContainerStyle: {
    backgroundColor: "red", // สีพื้นหลังเมื่อกรอก OTP
    borderColor: "#000", // สีกรอบเมื่อกรอก OTP
    borderWidth: 1,
    borderRadius: 8,
    width: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledPinCodeContainer: {
    backgroundColor: "#eeeded", // สีพื้นหลังเมื่อไม่สามารถกรอก OTP ได้
    borderColor: "#eeeded", // สีกรอบเมื่อไม่สามารถกรอก OTP ได้
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    includeFontPadding: false,
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendText: {
    marginTop: 15,
    color: "#007bff",
  },
});
