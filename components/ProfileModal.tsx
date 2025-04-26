import useNavigateToShareProfile from "@/composables/useNavigateToShareProfile";
import useNavigateToEditProfile from "@/composables/useNavigateToEditProfile";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Clipboard,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteConfirmModal from "./DeleteConfirmModal";
import * as SecureStore from "expo-secure-store";
import { fetchContact } from "@/composables/usefetchContact";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

interface ProfileModalProps {
  contactData: Contact | null | undefined;
  contactType: string;
  handleClose: () => void;
  onContactDeleted?: () => void;
}

interface UserProfile {
  contactId: number;
  username: string;
  users_firstname: string;
  users_lastname?: string;
  users_image?: string;
  users_phone: string;
  users_email: string;
  auth_provider: string;
}

interface Social {
  socialLink: string;
  socialPlatform: string;
}
interface Contact {
  userProfile: UserProfile;
  userSocials: Social[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  contactData,
  contactType,
  handleClose,
  onContactDeleted,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const { navigateToShareProfile } = useNavigateToShareProfile();
  const { navigateToEditProfile } = useNavigateToEditProfile();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteContact, setDeleteContact] = useState<any | null>();

  const OpenURLButton = ({
    url,
    children,
  }: {
    url: string;
    children: string;
  }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    const replacedLink = replaceSocialLink(children);

    return (
      <TouchableOpacity onPress={handlePress}>
        <Text>{replacedLink}</Text>
      </TouchableOpacity>
    );
  };

  const replaceSocialLink = (url: string) => {
    return url.replace(
      /(?:https?:\/\/)?(?:www\.)?(?:x\.com\/|facebook\.com\/|instagram\.com\/|linkedin\.com\/)([\w.]+)/,
      "@$1"
    );
  };
  const openMail = async (url: string) => {
    const supported = await Linking.canOpenURL("mailto:" + url);
    if (supported) {
      await Linking.openURL("mailto:" + url);
    } else {
      Alert.alert("Cannot open this URL:", url);
    }
  };

  const openCall = async (url: string) => {
    const supported = await Linking.canOpenURL("tel:" + url);
    if (supported) {
      await Linking.openURL("tel:" + url);
    } else {
      Alert.alert("Cannot open this URL:", url);
    }
  };
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const openDeleteModal = (contact: Contact) => {
    setDeleteContact(contact);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteContact = async () => {
    if (deleteContact) {
      const contactId = deleteContact.contactId;
      const token = await SecureStore.getItemAsync("my-jwt");

      const response = await fetchContact(
        token,
        `api/v1/contact/${contactId}`,
        "DELETE"
      );
      if (response === 200) {
        console.log("response: " + response);
        setIsDeleteModalOpen(false);
        setDeleteContact(null);
        handleClose();
        onContactDeleted?.();
      }
    }
  };

  if (!contactData) return null;

  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true} // Allows swiping down to close
          onClose={handleClose}
          backgroundStyle={{ height: 0 }}
          handleComponent={() => (
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
          )}
        >
          <BottomSheetScrollView style={styles.modalContainer}>
            <View className="pb-10">
              {contactData?.userProfile.users_image ? (
                <View style={styles.modalHeader}>
                  <ImageBackground
                    className="w-full h-full"
                    style={styles.systemImage}
                    source={{
                      uri: contactData.userProfile.users_image,
                    }}
                  >
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255,255,255,0)",
                        "rgba(0,0,0,0.65)",
                      ]}
                      locations={
                        Platform.OS === "android" ? [0, 0.4, 0.85] : [0.5, 0]
                      }
                      style={styles.linearBackground}
                    >
                      <Text
                        className="text-center text-white text-3xl"
                        style={styles.text}
                      >
                        {contactData?.userProfile.username}
                      </Text>
                      <Text
                        className="text-center text-white text-xl pb-7"
                        style={[styles.text, { fontFamily: "Poppins-Regular" }]}
                      >
                        {contactData?.userProfile.users_firstname}{" "}
                        {contactData?.userProfile.users_lastname}
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              ) : (
                contactData?.userProfile.users_image === null && (
                  <View style={styles.modalHeaderNoImage}>
                    <LinearGradient
                      colors={[
                        "transparent",
                        "rgba(255,255,255,0)",
                        "rgba(0,0,0,0.5)",
                      ]}
                      locations={[0.4, 0.4]}
                      style={styles.linearBackground}
                    >
                      <View style={styles.googleImage}>
                        <Image
                          className="w-36 h-36 opacity-60"
                          source={require("@/assets/icons/person-fill-icon.png")}
                        />
                        <Text className="text-center text-white text-3xl font-semibold">
                          {contactData?.userProfile.username}
                        </Text>
                        <Text className="text-center text-white text-xl pb-7">
                          {contactData?.userProfile.users_firstname}{" "}
                          {contactData?.userProfile.users_lastname}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                )
              )}
              {contactType === "myCard" && (
                <View style={styles.myCardOptionContainer}>
                  <TouchableOpacity
                    style={styles.myCardOptions}
                    className="justify-center items-center"
                    onPress={() => [navigateToEditProfile(), handleClose()]}
                  >
                    <Text style={[styles.text]}>Edit profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.myCardOptions}
                    className="justify-center items-center"
                    onPress={() => [navigateToShareProfile(), handleClose()]}
                  >
                    <Text style={[styles.text, { textAlign: "center" }]}>
                      Share contact
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {contactData?.userProfile.users_phone !== null && (
                <View style={styles.modalDetail}>
                  <Text className="pb-3" style={styles.text}>
                    Phone
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      openCall(contactData.userProfile.users_phone)
                    }
                    className="flex-row items-center"
                  >
                    <Text
                      style={[styles.text, { fontFamily: "Poppins-Regular" }]}
                    >
                      {contactData?.userProfile.users_phone}
                    </Text>
                    <Image
                      className="w-5 h-5 ml-2 opacity-70"
                      source={require("@/assets/icons/call-outbound-icon.png")}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.modalDetail}>
                <Text className="pb-3" style={styles.text}>
                  Email
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() =>
                      openMail(contactData?.userProfile.users_email)
                    }
                  >
                    <Text
                      className="text-[#3288BD]"
                      style={[styles.text, { fontFamily: "Poppins-Regular" }]}
                    >
                      {contactData?.userProfile.users_email}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(contactData?.userProfile.users_email)
                    }
                  >
                    <Image
                      className="w-4 h-4 ml-2"
                      source={require("@/assets/icons/document-copy-icon.png")}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {contactData?.userSocials.length > 0 && (
                <View style={styles.modalDetail}>
                  <Text className="pb-3" style={styles.text}>
                    Socials
                  </Text>
                  {contactData?.userSocials.map((item, index) => (
                    <View key={index} className="flex-row my-2 items-center">
                      <Image
                        source={
                          item.socialPlatform === "Instagram"
                            ? require("@/assets/icons/instagram-icon.png")
                            : item.socialPlatform === "X"
                            ? require("@/assets/icons/twitter-icon.png")
                            : item.socialPlatform === "LinkedIn"
                            ? require("@/assets/icons/linkedin-icon.png")
                            : item.socialPlatform === "Facebook"
                            ? require("@/assets/icons/facebook-icon.png")
                            : require("@/assets/icons/internet-icon.png")
                        }
                        style={styles.platformIcon}
                      />

                      <View style={{ marginLeft: 8 }}>
                        <OpenURLButton url={item.socialLink}>
                          {item.socialLink}
                        </OpenURLButton>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {contactType === "contacts" && (
                <View style={styles.modalDetail}>
                  <TouchableOpacity
                    onPress={() => {
                      openDeleteModal(contactData);
                    }}
                  >
                    <Text className="text-[#D71515]" style={styles.text}>
                      Delete Contact
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
        {isDeleteModalOpen && (
          <View>
            <DeleteConfirmModal
              isVisible={isDeleteModalOpen}
              onCancel={() => setIsDeleteModalOpen(false)}
              onConfirm={handleDeleteContact}
            />
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#F6F6F6",
    shadowColor: "black",
    shadowOffset: { width: 0, height: -20 },
    textShadowRadius: 10,
    shadowRadius: 15,
    shadowOpacity: 0.1,
    height: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalHeader: {
    width: "100%",
    height: 500,
  },
  modalHeaderNoImage: {
    width: "100%",
    height: 500,
    backgroundColor: "#acacac",
  },
  systemImage: {
    position: "absolute",
    resizeMode: "cover",
  },
  googleImage: {
    alignItems: "center",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    bottom: 0,
    marginBottom: 0,
  },
  emptyImage: {
    alignItems: "center",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    bottom: 0,
    marginBottom: 0,
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
  modalDetail: {
    marginTop: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#ffff",
    borderRadius: 20,
  },
  platformIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  customBackground: {},
  scanQr: {
    alignItems: "flex-end",
    backgroundColor: "transparent", // Make the background transparent
  },
  myCardOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 16,
  },
  myCardOptions: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffff",
    width: "47%",
    borderRadius: 20,
  },
  handleContainer: {
    position: "absolute",
    top: 10, // ปรับให้ Handle อยู่ภายในรูป
    left: "50%",
    transform: [{ translateX: -20 }],
    width: 40,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
  handle: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
  },
});
