import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import Overlay from "./Overlay"; // Assuming Overlay is a component that adds additional UI overlay
import { useNavigation } from "@react-navigation/native";
import { checkInByQRCode } from "@/composables/useCheckInAttendance";
import * as SecureStore from "expo-secure-store";

const ScanQR = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const isPermissionGranted = Boolean(permission?.granted);
  const [scanning, setScanning] = useState(false);

  const navigation = useNavigation();

  // Request camera permission when the component mounts
  useEffect(() => {
    // Check user role when component is mounted
    const checkUserRole = async () => {
      const userRole = await SecureStore.getItemAsync("role");

      if (userRole === "Attendee") {
        Alert.alert(
          "Access Denied",
          "You do not have permission to feature."
        );
        navigation.goBack();
      }
    };

    // Request permission and check user role
    requestPermission();
    checkUserRole();
  }, [requestPermission, navigation]);

  const barcodeScanned = async ({ data }: { data: string }) => {
    if (scanning) {
      return;
    }

    setScanning(true);
    setScannedValue(data);

    if (data) {
      try {
        const token = await SecureStore.getItemAsync("my-jwt");

        const response = await checkInByQRCode(
          token,
          data,
          "api/v2/check-in",
          "PUT"
        );

        if (!response || response.status !== 200) {
          throw new Error("Check-in failed! Please try again.");
        }

        setApiResponse("API call successful!");

        alert("Check-in successful!");
        navigation.goBack();
      } catch (error) {
        console.error("API Error:", error);
        setApiResponse("API call failed!");
        Alert.alert("Error", "Check-in failed! Please try again.");
      }
    } 

    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  if (isPermissionGranted) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={barcodeScanned}
        />
        <Overlay />
        <Text>{apiResponse}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View>
        <Text style={styles.errorMessage}>
          Please allow camera access to use this feature.
        </Text>
        <Pressable onPress={() => requestPermission()}>
          <Text style={styles.buttonStyle}>Request Permission</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ScanQR;

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    backgroundColor: "#008CBA",
    borderRadius: 5,
    color: "white",
    textAlign: "center",
  },
  errorMessage: {
    padding: 20,
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
});
