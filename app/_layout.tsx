import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const StackLayout = () => {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const TOKEN_KEY = "my-jwt";
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Token: ", token);
    };

    checkAuth();

    const inAuthGroup = segments[0] === "(tabs)";

    if (!authState?.authenticated && inAuthGroup) {
      console.log("Redirecting to /");
      router.replace("/");
    } else if (authState?.authenticated === true && segments[0] !== "(tabs)") {
      router.replace("/(tabs)/home");
    }
  }, [authState]);

  return (
    <Stack initialRouteName="(tabs)">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "OoohBaby-Regular": require("../assets/fonts/OoohBaby-Regular.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Base": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Meduim-Italic": require("../assets/fonts/Poppins-MediumItalic.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    async function configureNavigationBar() {
      try {
        await NavigationBar.setBackgroundColorAsync("#ffffffcc");
        await NavigationBar.setButtonStyleAsync("dark");
        await NavigationBar.setBorderColorAsync("#ffffff");
      } catch (error) {
        console.error("Error configuring Navigation Bar:", error);
      }
    }

    configureNavigationBar();
  }, []);

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
