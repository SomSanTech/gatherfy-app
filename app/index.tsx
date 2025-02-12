// import "../gesture/gesture-handler.native";
// import "react-native-gesture-handler";
// import TabNav from "./(tabs)/_layout";

// import { useCallback, useEffect, useState } from "react";
// import Entypo from "@expo/vector-icons/Entypo";
// import * as SplashScreen from "expo-splash-screen";
// import * as Font from "expo-font";

// import {
//   ScrollView,
//   Text,
//   TextInput,
//   View,
//   Image,
//   ActivityIndicator,
//   Button,
//   StyleSheet,
// } from "react-native";

// import { NavigationIndependentTree } from "@react-navigation/native";

// export default function App() {
//   return (
//     <NavigationIndependentTree>
//       <TabNav />
//     </NavigationIndependentTree>
//   );
// }

// const styles = StyleSheet.create({});

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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import { useAuth } from "./context/AuthContext";

type Props = {};

export default function App() {
  const { authState } = useAuth();

  useEffect(() => {
    
    if (authState?.authenticated === true) {
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
                  <Text style={styles.loginText}>
                    Don't have an account?{" "}
                    <Link href={"/signUp"}>
                      <Text style={styles.loginTextSpan}>Sign Up</Text>
                    </Link>
                  </Text>
                </Animated.View>
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
    fontSize: 34,
    color: Colors.black,
    letterSpacing: 2.4,
    fontFamily: "OoohBaby-Regular",
    marginBottom: 5,
  },

  description: {
    fontSize: 14,
    color: Colors.gray,
    letterSpacing: 1.2,
    lineHeight: 30,
    fontFamily: "Poppins-Regular",
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
    gap: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
  },
  loginText: {
    marginTop: 25,
    fontSize: 14,
    color: Colors.black,
    fontFamily: "Poppins-Light",
    includeFontPadding: false,
  },
  loginTextSpan: {
    color: Colors.primary,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 24,
    includeFontPadding: false,
  },
});

// import { View, Text } from 'react-native'
// import React from 'react'

// const Page = () => {
//   return (
//     <View>
//       <Text>Page</Text>
//     </View>
//   )
// }

// export default Page
