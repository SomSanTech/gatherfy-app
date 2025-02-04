import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { Overlay } from "./Overlay"; // Assuming Overlay is a component that adds additional UI overlay

const ScanQR = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const isPermissionGranted = Boolean(permission?.granted);

  // Request camera permission when the component mounts
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const barcodeScanned = async ({ data }: { data: string }) => {
    setTimeout(() => {
      Linking.openURL(data!);
    }, 200);
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setScannedValue(data); // Save the QR Code data

    if (data) {
      try {
        // Send the scanned value to the backend API
        const response = await fetch("YOUR_API_URL/v1/check-in", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${data}`, // Attach the scanned value as the token
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrCode: data }), // Example payload
        });
        const result = await response.json();
        setApiResponse(JSON.stringify(result, null, 2)); // Display the API response
      } catch (error) {
        console.error("API call failed:", error);
        setApiResponse("API call failed!");
      }
    }
  };

  if (isPermissionGranted) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={barcodeScanned}
        />
        <Overlay />

        {scannedValue && <Text>Scanned Value: {scannedValue}</Text>}
        {apiResponse && (
          <Text style={{ marginTop: 20, color: "blue" }}>
            API Response: {apiResponse}
          </Text>
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
        <Pressable onPress={requestPermission}>
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
