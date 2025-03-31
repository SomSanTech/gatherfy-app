import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
            title: "Sign Up",
          }}
        />
        <Stack.Screen
          name="signUp"
          options={{
            headerShown: false,
            title: "Sign Up",
          }}
        />
        <Stack.Screen
          name="otpScreen"
          options={{
            headerShown: false,
            title: "otpScreen",
          }}
        />
      </Stack>

      <StatusBar backgroundColor="transparent" style="dark" />
    </>
  );
};

export default AuthLayout;
