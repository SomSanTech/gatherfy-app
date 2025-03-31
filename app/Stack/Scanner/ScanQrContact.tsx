import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Clipboard,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import Overlay from "./Overlay"; // Assuming Overlay is a component that adds additional UI overlay
import { scanTokenByQRCode } from "@/composables/useCheckInAttendance";
import * as SecureStore from "expo-secure-store";
import ProfileModal from "@/components/ProfileModal";

interface Contact {
  userProfile: UserProfile;
  userSocials: Social[];
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
  socialLink: string;
  socialPlatform: string;
}

const ScanQrContact = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const isPermissionGranted = Boolean(permission?.granted);
  const [scanning, setScanning] = useState(false);
  const [contact, setContact] = useState<Contact | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactModalType, setContactModalType] = useState("");

  // Request camera permission when the component mounts
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const openModal = (detail: Contact) => {
    setSelectedContact(detail);
    setContactModalType("contacts");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  // const barcodeScanned = async ({ data }: { data: string }) => {
  //   if (scanning) {
  //     return;
  //   }
  //   setScanning(true);
  //   setScannedValue(data);

  //   if (data) {
  //     const token = await SecureStore.getItemAsync("my-jwt");

  //     const response = await scanTokenByQRCode(
  //       token,
  //       data,
  //       "api/v1/saveContact",
  //       "POST"
  //     );
  //     console.log("Get response: " + (await response.status));

  //     if (!response || response.status !== 200) {
  //       Alert.alert("Token invalid");
  //       throw new Error("Save contact failed! Please try again.");
  //     }
  //     setApiResponse("API call successful!");

  //     Alert.alert("Success", "Contact saved successfully!");
  //     setContact(response);
  //     openModal(response);
  //   }

  //   setTimeout(() => {
  //     setScanning(false);
  //   }, 2000);
  // };
  const barcodeScanned = async ({ data }: { data: string }) => {
    if (scanning) {
      return;
    }
    setScanning(true);
    setScannedValue(data);
  
    if (data) {
      const token = await SecureStore.getItemAsync("my-jwt");
  
      const response = await scanTokenByQRCode(
        token,
        data,
        "api/v1/saveContact",
        "POST"
      );
  
      if (!response) {
        Alert.alert("Error", "Failed to connect to the server.");
        setScanning(false);
        return;
      }
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        Alert.alert("Token invalid", `Error: ${response.status}`);
        setScanning(false);
        return;
      }
  
      const responseData = await response.json(); // แปลง JSON เฉพาะเมื่อ status = 200
      setApiResponse("API call successful!");
  
      Alert.alert("Success", "Contact saved successfully!");
      setContact(responseData);
      openModal(responseData);
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
        {isModalOpen && (
          <ProfileModal
            contactData={selectedContact}
            contactType={contactModalType}
            handleClose={handleCloseModal}
          />
        )}
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
