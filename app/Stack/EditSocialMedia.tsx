import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropdownComponent } from "@/components/Dropdown";
import {
  fetchSocialmedia,
  saveSocialMediaData,
} from "@/composables/useFetchSocialMedia";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/Ionicons";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import { Dropdown } from "react-native-element-dropdown";

import Animated, {
  FadeInDown,
  FadeOutUp,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

const socialPlatforms = [
  { label: "Facebook", value: "Facebook" },
  { label: "Instagram", value: "Instagram" },
  { label: "X", value: "X" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Website", value: "Website" },
];

const EditSocialMedia = () => {
  const flatListRef = useRef<FlatList>(null);
  const buttonPosition = useSharedValue(0); // ควบคุมตำแหน่งของปุ่ม
  const { navigateToGoBack } = useNavigateToGoBack();
  const [socialLinks, setSocialLinks] = useState<
    { socialId?: number; platform: string; link: string }[]
  >([]);

  const handleAddSocialMedia = () => {
    setSocialLinks((prevLinks) => {
      const newLinks = [...prevLinks, { platform: "", link: "" }];
      // ให้ปุ่มเคลื่อนไปทุกครั้งที่เพิ่ม
      buttonPosition.value = withSpring(buttonPosition.value + 50); // เพิ่มตำแหน่งลงไป 50px ทุกครั้งที่เพิ่ม
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return newLinks;
    });
  };

  const loadSocialMedia = async () => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");
      const socialMediaInfo = await fetchSocialmedia(token, "GET");

      if (socialMediaInfo.error) {
        console.error("Failed to fetch social media data");
        return;
      }

      // Map API response to the structure with socialId and platform
      const formattedSocialLinks = socialMediaInfo.map((item: any) => ({
        socialId: item.socialId, // socialId from API response
        platform: item.socialPlatform || "Other", // Default to "Other" if missing
        link: item.socialLink || "", // Default to empty if no link
      }));

      setSocialLinks(formattedSocialLinks);
    } catch (error) {
      console.error("Error fetching social media:", error);
    }
  };

  const handleChange = (value: string, index: number) => {
    setSocialLinks((prevLinks) =>
      prevLinks.map((item, idx) =>
        idx === index ? { ...item, platform: value } : item
      )
    );
  };

  const removeSocialMedia = (index: number) => {
    setSocialLinks((prevLinks) => {
      const updatedLinks = prevLinks.filter((_, idx) => idx !== index);
      if (updatedLinks.length === 0) {
        buttonPosition.value = withSpring(0); // หากไม่มีรายการปุ่มจะกลับไปที่ตำแหน่งเดิม
      } else {
        buttonPosition.value = withSpring(buttonPosition.value - 50); // เลื่อนปุ่มขึ้นทุกครั้งที่ลบ
      }
      return updatedLinks;
    });
  };

  const saveSocialMedia = async () => {
    try {
      const token = await SecureStore.getItemAsync("my-jwt");

      // Create the socialMediaData to send to the backend
      const socialMediaData = socialLinks.map((item) => ({
        ...(item.socialId ? { socialId: item.socialId } : {}), // Add socialId if present
        socialPlatform: item.platform,
        socialLink: item.link,
      }));

      // Send the socialMediaData to the backend (implement saveSocialMediaData)
      const result = await saveSocialMediaData(token, socialMediaData, "PUT");

      if (
        typeof result === "object" &&
        "message" in result &&
        result.message === "Social links updated successfully"
      ) {
        Alert.alert("Success", "Social media saved successfully");
      } else {
        Alert.alert("Unsuccess", "Failed to save social media");
      }
    } catch (error) {
      console.error("Error saving social media:", error);
    }
  };

  useEffect(() => {
    loadSocialMedia();
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white pb-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navigateToGoBack}>
            <Icon name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Social Media</Text>
        </View>
        <FlatList
          ref={flatListRef}
          contentContainerStyle={{ flexGrow: 1, padding: 15 }}
          showsVerticalScrollIndicator={false}
          data={socialLinks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(200).duration(500).springify()}
              exiting={FadeOutUp.delay(200).duration(500).springify()}
              style={styles.boxContainer}
            >
              <View style={styles.inputContainer}>
                <View style={styles.dropdownContainer}>
                  <DropdownComponent
                    options={socialPlatforms}
                    defaultValue={item.platform}
                    indexFromParent={index} // pass index to identify which item to update
                    onSelect={(value) => handleChange(value, index)}
                  />
                </View>
                <TextInput
                  style={styles.linkInput}
                  placeholder="Enter link"
                  value={item.link}
                  onChangeText={(text) =>
                    setSocialLinks((prevLinks) =>
                      prevLinks.map((link, idx) =>
                        idx === index ? { ...link, link: text } : link
                      )
                    )
                  }
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSocialMedia(index)}
                >
                  <Icon name="trash-outline" size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
          ListFooterComponent={
            <Animated.View
              entering={FadeInDown.delay(200).duration(500).springify()}
              exiting={FadeOutUp.delay(200).duration(500).springify()}
              style={styles.addButtonContainer}
            >
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddSocialMedia}
              >
                <View className="flex-row items-center">
                  <Icon
                    name="add-circle-outline"
                    size={30}
                    color={Colors.black}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.addButtonText}>Add Social Media</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          }
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveSocialMedia}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    marginBottom: 20,
  },
  boxContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dropdownContainer: {
    flex: 1.2,
    marginRight: 10,
  },
  linkInput: {
    flex: 2.5,
    height: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    includeFontPadding: false,
    fontFamily: "Poppins-Regular",
  },
  removeButton: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addButtonContainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    marginTop: 0,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    includeFontPadding: false,
    color: Colors.black,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  saveButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  headerText: {
    includeFontPadding: false,
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
});

export default EditSocialMedia;
