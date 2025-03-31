import "../gesture/gesture-handler.native";
import "react-native-gesture-handler";
import TabNav from "./(tabs)/_layout";

import { useCallback, useEffect, useState } from "react";
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
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { signInGoogle } from "@/composables/signinGoogle";
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from "@/app/files";

// GoogleSignin.configure({
//   webClientId: WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
//   scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   iosClientId: IOS_CLIENT_ID, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//   profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });

export default function App() {
  const { authState } = useAuth();

  useEffect(() => {
    if (authState?.authenticated === true && authState.verifyEmail === true) {
      console.log("Redirecting to /home");
      router.replace("/(tabs)/home");
    }
  }, []);

  return (
    <>
      <StatusBar backgroundColor="transparent" style="dark" />
      <ImageBackground
        source={require("@/assets/images/onboarding-background-2.jpeg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <LinearGradient
            colors={[
              "transparent",
              "rgba(255,255,255,0.9)",
              "rgba(255,255,255,1)",
            ]}
            style={styles.linearBackground}
          >
            <View style={styles.wrapper}>
              <Animated.Text
                style={styles.title}
                entering={FadeInRight.delay(300).duration(300).springify()}
              >
                Welcome To Gatherfy
              </Animated.Text>
              <Animated.Text
                style={styles.description}
                entering={FadeInRight.delay(500).duration(300).springify()}
              >
                Effortless Event Coordination
              </Animated.Text>
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
                {/* <Animated.View
                  entering={FadeInDown.delay(600).duration(400).springify()}
                >
                  <CustomButton
                    title="Continue with Google"
                    handlePress={() => router.push("/signIn")}
                    containerStyles={styles.button}
                    textStyle={styles.buttonText}
                    IconComponent={<Google width={20} height={20} />}
                  />
                </Animated.View> */}
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
                {/* <Animated.View
                  entering={FadeInDown.delay(1200).duration(400).springify()}
                >
                  <TouchableOpacity
                    onPress={() => router.push("/otpScreen")}
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 20,
                      padding: 5,
                    }}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color={Colors.black}
                      style={{ opacity: 0.5 }}
                    />
                  </TouchableOpacity>
                </Animated.View> */}
              </View>
            </View>
          </LinearGradient>
        </View>
      </ImageBackground>
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
