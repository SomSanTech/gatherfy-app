import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "SomJitIstalic-Regular": require("../assets/fonts/SomJitItalic-Regular.ttf"),
    "TorsilpKhwamRiang": require("../assets/fonts/TorsilpKhwamRiang.ttf"),
    "JacquesFrancois-Regular": require("../assets/fonts/JacquesFrancois-Regular.ttf"),
    "OoohBaby-Regular": require("../assets/fonts/OoohBaby-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
