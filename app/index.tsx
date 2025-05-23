import "../gesture/gesture-handler.native";
import "react-native-gesture-handler";
import TabNav from "./(tabs)/_layout";

import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Entypo from "@expo/vector-icons/Entypo";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

import Google from "@/assets/images/google-logo.svg";
import { SvgXml } from "react-native-svg";

import {
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import React from "react";
import { Link, Redirect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import CustomButton from "@/components/CustomButton";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useAuth } from "./context/AuthContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function App() {
  const { authState, onLoginGoogle } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (authState?.authenticated === true && authState.verifyEmail === true) {
      router.replace("/(tabs)/home");
    }
  }, []);

  return (
    <>
      <StatusBar backgroundColor="transparent" style="dark" />
      <View className="flex-1 relative bg-white">
        <View className="absolute inset-0 w-full top-[41%]">
          <Animated.View
            entering={FadeInDown.delay(100).duration(400).springify()}
            className="w-full"
          >
            <Text className="text-6xl text-primary text-center w-full font-League-Gothic uppercase">
              Gatherfy
            </Text>
            <Text
              className="text-xl mt-2 text-primary text-center w-full  font-League-Gothic"
              style={{ letterSpacing: 1.4 }}
            >
              Effortless Event Coordination
            </Text>
          </Animated.View>
        </View>
        <View style={styles.container}>
          <View style={styles.linearBackground}>
            <View style={styles.wrapper}>
              <View style={styles.socialLoginWrapper}>
                <Animated.View
                  entering={FadeInDown.delay(300).duration(400).springify()}
                >
                  <CustomButton
                    title="Continue with Username"
                    handlePress={() => router.push("/signIn")}
                    containerStyles={styles.button}
                    textStyle={styles.buttonText}
                    IconComponent={
                      <Ionicons
                        name="person-circle-outline"
                        size={20}
                        color={Colors.black}
                      />
                    }
                  />
                </Animated.View>
                <Animated.View
                  entering={FadeInDown.delay(600).duration(400).springify()}
                >
                  <CustomButton
                    title="Continue with Google"
                    handlePress={onLoginGoogle || (() => {})}
                    containerStyles={styles.button}
                    textStyle={styles.buttonText}
                    IconComponent={<Google width={20} height={20} />}
                  />
                </Animated.View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Animated.View
                  entering={FadeInDown.delay(1000).duration(400).springify()}
                >
                  <Text style={styles.signUpText}>
                    Don't have an account?{" "}
                    <Link href={"/signUp"}>
                      <Text style={styles.signUpTextSpan}>Sign Up</Text>
                    </Link>
                  </Text>
                </Animated.View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  wrapper: {
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: wp(7.5),
    textAlign: "center",
    color: Colors.black,
    letterSpacing: 2.4,
    fontFamily: "OoohBaby-Regular",
    marginBottom: 5,
  },
  description: {
    fontSize: wp(2.8),
    color: Colors.gray,
    letterSpacing: 1.2,
    lineHeight: 30,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  socialLoginWrapper: {
    alignSelf: "stretch",
  },
  button: {
    flexDirection: "row",
    padding: 10,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.black,
    fontSize: wp(3.3),
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
  },
  signUpText: {
    marginTop: 25,
    fontSize: wp(2.9),
    color: Colors.black,
    fontFamily: "Poppins-Light",
    includeFontPadding: false,
  },
  signUpTextSpan: {
    color: Colors.primary,
    fontSize: wp(2.9),
    fontFamily: "Poppins-SemiBold",
    lineHeight: 24,
    includeFontPadding: false,
  },
});
