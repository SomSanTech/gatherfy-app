import { StyleSheet, Text, View } from "react-native";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import App from ".";
import { AppProvider } from "@/components/AppContext";
import * as NavigationBar from 'expo-navigation-bar';

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
    async function configureNavigationBar() {
      try {
        // ตั้งค่าพื้นหลังโปร่งใส
        await NavigationBar.setBackgroundColorAsync('#ffffffcc');
        // ตั้งค่าให้ปุ่มใน Navigation Bar เป็นสีอ่อน (หากพื้นหลังเป็นสีเข้ม)
        await NavigationBar.setButtonStyleAsync('dark');
        NavigationBar.setBorderColorAsync("#ffffff");
      } catch (error) {
        console.error('Error configuring Navigation Bar:', error);
      }
    }
  
    configureNavigationBar();
  }, []);

  useEffect(() => {
    
  }, []);
  

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <AppProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
    </AppProvider>
  );
};

export default RootLayout;
