import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  Clipboard,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import Overlay from "./Overlay"; // Assuming Overlay is a component that adds additional UI overlay
import { useNavigation } from "@react-navigation/native";
import { checkInByQRCode } from "@/composables/useCheckInAttendance";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import useNavigateToContactDetail from "@/composables/useNavigateToContactDetail";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface Contact {
    userProfile: UserProfile 
    userSocials: Social[]
  }
interface UserProfile {
contactId: number;
username: string;
users_firstname: string;
users_lastname: string;
users_image: string;
users_phone: string;
users_email: string;
auth_provider: string;
}
interface Social {
    socialLink: string,
    socialPlatform: string
  }


const ScanQrContact = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const isPermissionGranted = Boolean(permission?.granted);
  const [scanning, setScanning] = useState(false);
  const [contact, setContact] = useState<Contact | null>();

  type NavigationProp = StackNavigationProp<RootStackParamList, "ContactDetail">;
  const navigation = useNavigation<NavigationProp>();
  // const navigation = useNavigation();
  const { navigateToContactDetail } = useNavigateToContactDetail()

  // Request camera permission when the component mounts
  useEffect(() => {
    // Check user role when component is mounted
    // const checkUserRole = async () => {
    //   const userRole = await SecureStore.getItemAsync("role");

    //   if (userRole === "Attendee") {
    //     Alert.alert("Access Denied", "You do not have permission to feature.");
    //     navigation.goBack();
    //   }
    // };

    // Request permission and check user role
    requestPermission();
    // checkUserRole();
  }, [requestPermission, navigation]);

  const barcodeScanned = async ({ data }: { data: string }) => {
    if (scanning) {
      return;
    }
    setScanning(true);
    console.log("Scanning qr contact")
    setScannedValue(data);

    if (data) {
      console.log("Data: " + data)

      const token = await SecureStore.getItemAsync("my-jwt");

      const response = await checkInByQRCode(
        token,
        data,
        "api/v1/saveContact",
        "POST"
      );
      console.log("Get response: " + await response)

      if (!response) {
        console.log("!response")
        throw new Error("Save contact failed! Please try again.");
      }

      setApiResponse("API call successful!");
      console.log("apiResponse: " + apiResponse)

      alert("Save contact!");
      setContact(response)
      // bottomSheetRef.current?.expand() // Open the modal
      console.log("navigateToContactDetail:", JSON.stringify(response, null, 2));
      navigation.navigate("ContactDetail", { contactData: response });
      navigateToContactDetail({ response }); // ✅ Correct key
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

export default ScanQrContact;

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
