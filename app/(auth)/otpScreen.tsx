import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { useResendOTP, useSendOTP } from "@/composables/useFetchOTP";
import * as SecureStore from "expo-secure-store";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Link, Redirect, router } from "expo-router";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { set } from "lodash";

type AuthStackParamList = {
  OTPScreen: { email: string };
};

type OTPScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "OTPScreen"
>;

const OTPScreen = ({ navigation }: { navigation: OTPScreenNavigationProp }) => {
  const { onVerifiedEmail } = useAuth();
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [countdownTime, setCountdownTime] = useState(180); // 180 seconds (3 minutes)
  const [canResend, setCanResend] = useState(false); // Flag to control resend button state
  const useNavigate = useNavigation();

  const route = useRoute<RouteProp<AuthStackParamList, "OTPScreen">>();
  // const email = route.params?.email || ""; // ✅ รับ email ที่ส่งมา
  const [email, setEmail] = useState<string | null>(null);

  const getEmail = async () => {
    if (route.params?.email) {
      setEmail(route.params.email);
    } else {
      let emailFromStore = null;

      // 🔄 รอจนกว่าจะอ่านค่า email ได้
      while (!emailFromStore) {
        emailFromStore = await SecureStore.getItemAsync("email");
      }

      setEmail(emailFromStore);
    }
  };

  useEffect(() => {
    // Start countdown when the screen loads
    const timer = setInterval(() => {
      setCountdownTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setCanResend(true); // Enable resend button after 3 minutes
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clear the timer when component unmounts
  }, []);
  useEffect(() => {
    getEmail();
  }, []); // เรียก getEmail เมื่อ component โหลดครั้งแรก

  useEffect(() => {
    if (email && !route.params?.email) {
      handleResendOTP();
    }
  }, [email]); // รอ email เปลี่ยนแปลงก่อนส่ง OTP

  const handleConfirm = async (fillOTP: string) => {
    if (!fillOTP || !email) {
      Alert.alert("Unsuccess", "OTP or Email is missing.");
      setSending(false);
      return;
    }

    // หาก email ยังไม่ได้มาใน props หรือ route.params ให้ดึงจาก SecureStore
    if (!email) {
      await SecureStore.getItemAsync("email");
    }

    console.log("Entered OTP:", fillOTP);
    setSending(true);

    // ส่ง OTP ไปตรวจสอบ
    const response = await useSendOTP(`/api/v1/verify-otp`, fillOTP, email);

    console.log("useSendOTP response:", response);

    if (response.success) {
      console.log("OTP verification successful:", response.data);

      // ตั้งค่า verifyEmail เป็น true
      await onVerifiedEmail!(true);

      // ตรวจสอบว่า email มาจาก route.params หรือไม่
      if (route.params?.email) {
        Alert.alert(response.data, "Please login to continue");
        // ถ้า email มาจาก route.params ให้ไปหน้า signIn
        (useNavigate as any).reset({
          index: 0,
          routes: [{ name: "signIn" }],
        });
      } else {
        // ถ้า email มาจาก SecureStore ให้ไปหน้า home
        router.replace("/(tabs)/home");
      }
    } else {
      console.log("OTP verification failed:", response.message);
      Alert.alert("Unsuccess", response.message || "OTP verification failed.");
    }

    setSending(false);
  };

  const handleResendOTP = async () => {
    console.log(email);

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
    setCountdownTime(180); // Reset countdown timer when OTP is resent
    setCanResend(false); // Disable resend button immediately after sending
  };

  // Function to format countdown time into minutes and seconds
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white">
      <Animated.View
        entering={FadeInDown.delay(300).duration(400).springify()}
        style={styles.container}
      >
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.description}>We've sent an OTP to your phone.</Text>
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
            pinCodeContainerStyle: styles.pinCodeContainerStyle,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleConfirm(otp)}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={!canResend} // Disable the button if resend is not allowed
        >
          <Text
            style={canResend ? styles.resendText : styles.resentTextDisbled}
          >
            {canResend
              ? "Resend OTP"
              : `Resend OTP in ${formatTime(countdownTime)}`}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    height: hp("90%"),
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pinContainer: {
    height: hp("10%"),
    width: wp("85%"),
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 50,
  },
  pinCodeText: {
    fontSize: wp(7),
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    includeFontPadding: false,
  },
  pinCodeContainerStyle: {
    height: hp("7%"),
    width: wp("12%"),
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
    fontSize: wp(5.2),
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    includeFontPadding: false,
    marginBottom: 20,
  },
  description: {
    fontSize: wp(3.8),
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: hp(3),
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: wp(3.8),
    includeFontPadding: false,
  },
  resendText: {
    marginTop: hp(3),
    fontFamily: "Poppins-SemiBold",
    fontSize: wp(3.2),
    includeFontPadding: false,
    color: "#007bff",
  },
  resentTextDisbled: {
    marginTop: hp(3),
    fontFamily: "Poppins-SemiBold",
    fontSize: wp(3.2),
    includeFontPadding: false,
    color: Colors.gray,
    opacity: 0.5,
  },
});
