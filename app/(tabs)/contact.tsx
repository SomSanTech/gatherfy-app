import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  Modal,
  ImageBackground,
  ScrollViewBase,
  Linking,
  Alert,
  Clipboard,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchContact } from "@/composables/usefetchContact";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "@/components/SearchInput";
import {
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";
import DefaultProfile from "@/assets/images/default-profile.svg";
import { Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "react-native-elements";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { useCameraPermissions } from "expo-camera";
import { fetchQrToken } from "@/composables/useFetchQrToken";
import useNavigateToShareProfile from "@/composables/useNavigateToShareProfile";
import ProfileModal from "@/components/ProfileModal";

const Contact = () => {
  interface Profile {
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
  interface Contact {
    userProfile: UserProfile
    userSocials: Social[]
  }

  interface OpenURLButtonProps {
    url: string;
    children: string;
  };
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const navigation = useNavigation<any>(); // ดึง navigation มาใช้ใน component
  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>();
  const [contactModalType, setContactModalType] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [permission, requestPermission] = useCameraPermissions();

  // Convert object into an array of sections
  const sections = Object.keys(contacts).map((key: string) => ({
    title: key,
    data: contacts[key],
  }));

  console.log("Section: " + sections);

  const fetchProfile = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    try {
      const response = await fetchContact(
        token,
        "api/v2/profile",
        "GET"
      );
      setProfile(response);
      console.log(response)
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchContacts = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    try {
      setIsLoading(true);
      const response = await fetchContact(
        token,
        "api/v2/contacts",
        "GET"
      );

      if (response) {
        setContacts(response);
        console.log("response: " + contacts);

      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const navigateToScanQrContact = () => {
    if (permission?.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow camera permission to scan QR code."
      );
      requestPermission();
      return;
    }
    requestPermission();
    navigation.navigate("ScanQrContact");
  };

  const openModal = (type: string, detail: Contact | Profile) => {
    if (type === "myCard") {
      setSelectedContact(detail);
      setModalType("myCard")
      setContactModalType("myCard")
      setIsModalOpen(true)
      console.log(detail)

    } else if (type === "contacts") {
      setSelectedContact(detail);
      setModalType("contacts")
      setContactModalType("contacts")
      setIsModalOpen(true)
    }
    console.log(detail);
  };

  const handleCloseModal = () => {
    // bottomSheetRef.current?.close();
    setIsModalOpen(false)
    setSelectedContact(null)
    console.log(selectedContact)
  }

  useEffect(() => {
    fetchProfile();
    fetchContacts();
    if (selectedContact && bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Open the BottomSheet when selectedContact is updated
    }
  }, [selectedContact]);

  const onRefresh = useCallback(() => {
    if (isLoading) return; // Prevent refresh if already loading
    setRefreshing(true);
    fetchProfile();
    fetchContacts();
  }, [isLoading]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <Text style={styles.header}>Contacts</Text>
      <TouchableOpacity onPress={() => openModal("myCard", profile)} style={styles.myCardContainer}>
        <Image
          source={{ uri: profile?.userProfile.users_image }}
          style={styles.myCardImage}
        />
        <View>
          <Text style={styles.myCardUsername}>
            {profile?.userProfile.username}
          </Text>
          <Text>My Card</Text>
        </View>
      </TouchableOpacity>
      <SectionList
        sections={sections}
        data={contacts}
        keyExtractor={(item) => item.contactId.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            // onPress={() => navigation.navigate("ContactDetail", { contactId: item.contactId })} // ✅ แก้ให้ navigation ใช้ตรงนี้
            onPress={() => openModal("contacts", item)} // ✅ แก้ให้ navigation ใช้ตรงนี้
          >
            {item.userProfile.users_image ? (
              <Image
                source={{
                  uri: item.userProfile
                    .users_image,
                }}
                style={styles.contactImage}
              />
            ) : (
              <DefaultProfile
                style={styles.contactImage}
              />
            )}
            <View>
              <Text style={styles.contactName}>
                {item.userProfile.username}
              </Text>
              <Text style={styles.contactFullname}>
                {
                  item.userProfile
                    .users_firstname
                }{" "}
                {
                  item.userProfile
                    .users_lastname
                }
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No contacts found
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary, "#FF9800"]}
            tintColor={Colors.primary}
            progressViewOffset={1}
          />
        }
      />
      <TouchableOpacity onPress={() => navigateToScanQrContact()} style={styles.scanQr}>
        <ImageBackground style={{ backgroundColor: "transparent" }} className="w-16 h-16" source={require("@/assets/icons/qr-code-icon.png")} />
      </TouchableOpacity>
      {isModalOpen && (
        <ProfileModal
          contactData={selectedContact}
          contactType={contactModalType}
          handleClose={handleCloseModal}>
        </ProfileModal>
      )}
    </SafeAreaView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 10,
    paddingHorizontal: 16,
    color: "#9B9B9B",
    fontSize: 14,
  },
  myCardContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  myCardUsername: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  myCardImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    margin: 16,
  },
  contactItem: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ccc",
    alignContent: "center",
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  contactName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  contactFullname: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  emptyText: {
    margin: 16,
  },
  modalContainer: {
    backgroundColor: "#F6F6F6",
    shadowColor: "black",
    shadowOffset: { width: 0, height: -20 },
    textShadowRadius: 10,
    shadowRadius: 15,
    shadowOpacity: 0.1,
    height: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25
  },
  modalHeader: {
    width: "100%",
    height: 500,
  },
  modalHeaderNoImage: {
    width: "100%",
    height: 500,
    backgroundColor: "#acacac"
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
    marginBottom: 0
  },
  emptyImage: {
    alignItems: "center",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    bottom: 0,
    marginBottom: 0
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
    marginRight: 6
  },
  customBackground: {

  },
  scanQr: {
    alignItems: "flex-end",
    backgroundColor: "transparent", // Make the background transparent
  },
  myCardOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 16
  },
  myCardOptions: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffff",
    width: "47%",
    borderRadius: 20
  }
});
