import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  ImageBackground,
  Alert,
  Clipboard,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchContact } from "@/composables/usefetchContact";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "@/components/SearchInput";
import { RefreshControl } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import DefaultProfile from "@/assets/images/default-profile.svg";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCameraPermissions } from "expo-camera";
import ProfileModal from "@/components/ProfileModal";
import { useFocusEffect } from "expo-router";
import Animated from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Contact = () => {
  interface Profile {
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
  interface Contact {
    userProfile: UserProfile;
    userSocials: Social[];
  }

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<UserProfile[]>([]);
  const [filterdContacts, setFilterdContacts] = useState<UserProfile[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const navigation = useNavigation<any>(); // ดึง navigation มาใช้ใน component
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>();
  const [contactModalType, setContactModalType] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [search, setSearch] = useState<string>(""); // ใช้ useState สำหรับ search

  // Convert object into an array of sections
  const sections = Object.keys(filterdContacts).map((key: string) => ({
    title: key,
    data: filterdContacts[key],
  }));

  const originalSections = Object.keys(contacts).map((key: string) => ({
    title: key,
    data: contacts[key],
  }));

  const fetchProfile = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    try {
      const response = await fetchContact(token, "api/v2/profile", "GET");
      setProfile(response);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchContacts = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    try {
      setIsLoading(true);
      const response = await fetchContact(token, "api/v2/contacts", "GET");
      if (response) {
        setContacts(response);
        setFilterdContacts(response);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const navigateToScanQrContact = async () => {
    const permissionResult = await requestPermission();
    if (permissionResult?.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow camera permission to scan QR code."
      );
      return;
    }
    navigation.navigate("ScanQrContact");
  };

  const openModal = (type: string, detail: Contact) => {
    if (type === "myCard") {
      setSelectedContact(detail);
      setModalType("myCard");
      setContactModalType("myCard");
      setIsModalOpen(true);
    } else if (type === "contacts") {
      setSelectedContact(detail);
      setModalType("contacts");
      setContactModalType("contacts");
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleSearchSubmit = () => {
    let result: { [key: string]: Contact[] } = {};
    originalSections.forEach((section) => {
      const filteredUsers = section.data.filter((contact: Contact) => {
        return contact.userProfile.username
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      if (filteredUsers.length > 0) {
        result[section.title] = filteredUsers; // Assuming each section has a 'title' key
      }
    });
    setFilterdContacts(result);
  };

  const refreshContacts = async () => {
    fetchContacts();
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchContacts();
    }, [])
  );
  useEffect(() => {
    fetchProfile();
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact && bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Open the BottomSheet when selectedContact is updated
    }
  }, [selectedContact]);

  useEffect(() => {
    handleSearchSubmit();
  }, [search]);

  const onRefresh = useCallback(() => {
    if (isLoading) return; // Prevent refresh if already loading
    setRefreshing(true);
    fetchProfile();
    fetchContacts();
  }, [isLoading]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white pb-24">
      <Text className="text-xl font-Poppins-SemiBold text-center" style={styles.header}>Contacts</Text>
      <TouchableOpacity
        onPress={() => profile && openModal("myCard", profile)}
        style={styles.myCardContainer}
      >
        {profile?.userProfile.users_image ? (
          <Image
            source={{
              uri: profile.userProfile.users_image,
            }}
            style={styles.contactImage}
          />
        ) : (
          <Image
            source={require("@/assets/icons/person-fill-icon.png")}
            style={styles.contactImage}
            className="opacity-70"
          />
        )}
        <View className="flex-1">
          <Text
            style={styles.myCardUsername}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {profile?.userProfile.username}
          </Text>
          <Text style={styles.description}>My Card</Text>
        </View>
      </TouchableOpacity>
      <SearchInput
        value={search}
        onChangeText={setSearch} // ส่งฟังก์ชัน setSearch ไปยัง SearchInput
        onSearchSubmit={handleSearchSubmit}
      />
      <SectionList
        sections={sections}
        data={contacts}
        keyExtractor={(item) => item.contactId}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => openModal("contacts", item)} // ✅ แก้ให้ navigation ใช้ตรงนี้
          >
            {item.userProfile.users_image ? (
              <Image
                source={{
                  uri: item.userProfile.users_image,
                }}
                style={styles.contactImage}
              />
            ) : (
              <Image
                source={require("@/assets/icons/person-fill-icon.png")}
                style={styles.contactImage}
                className="opacity-70"
              />
            )}
            <View>
              <Text style={styles.contactName}>
                {item.userProfile.username}
              </Text>
              <Text style={styles.contactFullname}>
                {item.userProfile.users_firstname}{" "}
                {item.userProfile.users_lastname}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {search === "" ? (
              <Text style={styles.emptyText}>You have no contact</Text>
            ) : (
              <Text style={styles.emptyText}>No Results for "{search}"</Text>
            )}
          </View>
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
      <View className="absolute bottom-2 right-2">
        <TouchableOpacity
          onPress={() => navigateToScanQrContact()}
          style={styles.scanQr}
        >
          {/* <ImageBackground style={{ backgroundColor: "transparent" }} className="w-16 h-16" source={require("@/assets/icons/qr-code-icon.png")} /> */}
          <ImageBackground
            style={{ backgroundColor: "transparent" }}
            className="w-12 h-12 opacity-90"
            source={require("@/assets/icons/StashQrCodeLight.png")}
          />
        </TouchableOpacity>
      </View>
      {isModalOpen && (
        <ProfileModal
          contactData={selectedContact}
          contactType={contactModalType}
          handleClose={handleCloseModal}
          onContactDeleted={refreshContacts}
        ></ProfileModal>
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
    // paddingVertical: 20,
    paddingTop: 16,
    paddingBottom: 6,
    alignItems: "center",
  },
  myCardUsername: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    paddingRight: 20,
  },
  myCardImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 16,
  },
  header: {
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
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  contactFullname: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  emptyContainer: {
    justifyContent: "center",
    margin: "auto",
  },
  emptyText: {
    fontFamily: "Poppins-SemiBold",
    margin: 20,
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
});
