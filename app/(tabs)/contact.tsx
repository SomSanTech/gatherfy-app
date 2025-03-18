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
  const [selectedContact, setSelectedContact] = useState<Contact | null>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const { navigateToShareProfile } = useNavigateToShareProfile()

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
      const response = await fetchContact(
        token,
        "api/v2/contacts",
        "GET"
      );

      if (response) {
        // แปลงโครงสร้างข้อมูลให้อยู่ในรูปแบบที่เหมาะสม
        // console.log("response: " + response)
        // const formattedContacts = Object.entries(response)
        // .flatMap(([groupKey, contact]) =>
        //   contacts.map((item: any) => ({
        //   contactId: item.contactId,
        //   group: groupKey,
        //   username: item.userProfile.username,
        //   users_firstname: item.userProfile.users_firstname,
        //   users_lastname: item.userProfile.users_lastname,
        //   users_image: item.userProfile.users_image, // เอาไว้แสดงรูปภาพ
        // })));
        setContacts(response);
        console.log("response: " + contacts);

      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const OpenURLButton = ({ url, children }: { url: string; children: string }) => {
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

    const replacedLink = replaceSocialLink(children)

    return (<TouchableOpacity onPress={handlePress}>
      <Text>{replacedLink}</Text>
    </TouchableOpacity>);
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
  const [permission, requestPermission] = useCameraPermissions();

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


  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const replaceSocialLink = (url: string) => {
    return url.replace(/(?:https?:\/\/)?(?:www\.)?(?:x\.com\/|facebook\.com\/|instagram\.com\/|linkedin\.com\/)([\w.]+)/, "@$1");
  }

  const openModal = (type: string, detail: Contact | Profile) => {
    if (type === "myCard") {
      setSelectedContact(detail);
      setModalType("myCard")
      if (selectedContact) {
        bottomSheetRef.current?.expand() // Open the modal
        // setModalVisible(true);
      }

    } else if (type === "contacts") {
      setSelectedContact(detail);
      setModalType("contacts")
      if (selectedContact) {
        bottomSheetRef.current?.expand() // Open the modal
        // setModalVisible(true);
      }
    }
    console.log(detail);
  };

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setSelectedContact(null)
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
      {selectedContact && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true} // Allows swiping down to close
          onClose={handleClosePress}
          backgroundStyle={{ height: 0 }}
        >
          <BottomSheetScrollView style={styles.modalContainer}>
            <View className="pb-10">
              {/* <Pressable
              className="absolute z-40"
              onPress={() =>
                setModalVisible(!modalVisible)
              }
            >
              <Text>Hide Modal</Text>
            </Pressable> */}

              {selectedContact?.userProfile.users_image ?
                <View
                  style={
                    styles.modalHeader
                  }
                >
                  {selectedContact?.userProfile.auth_provider === "system" ? (
                    <ImageBackground
                      className="w-full h-full"
                      style={
                        styles.systemImage
                      }
                      source={{
                        uri: selectedContact.userProfile.users_image,
                      }}
                    >
                      <LinearGradient
                        colors={[
                          "transparent",
                          "rgba(255,255,255,0)",
                          "rgba(0,0,0,0.65)",
                        ]}
                        locations={[0.5, 0]}
                        style={
                          styles.linearBackground
                        }
                      >
                        <Text className="text-center text-white text-3xl font-semibold">
                          {
                            selectedContact?.userProfile.username
                          }
                        </Text>
                        <Text className="text-center text-white text-xl pb-7">
                          {
                            selectedContact?.userProfile.users_firstname
                          }
                          {" "}
                          {
                            selectedContact?.userProfile.users_lastname
                          }
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                  ) : selectedContact?.userProfile.auth_provider === "google" && (
                    <View style={styles.modalHeader}>
                      <ImageBackground
                        className="w-full h-full"
                        blurRadius={3}
                        source={{
                          uri: selectedContact.userProfile.users_image,
                        }}
                      >
                        <LinearGradient
                          colors={[
                            "transparent",
                            "rgba(255,255,255,0)",
                            "rgba(0,0,0,0.65)",
                          ]}
                          locations={[0.5, 0]}
                          style={
                            styles.linearBackground
                          }
                        >
                          <View style={styles.googleImage}>

                            <Image source={{ uri: selectedContact.userProfile.users_image }} className="w-36 h-36 rounded-full" />
                            <Text className="text-center text-white text-3xl font-semibold">
                              {
                                selectedContact?.userProfile.username
                              }
                            </Text>
                            <Text className="text-center text-white text-xl pb-7">
                              {
                                selectedContact?.userProfile.users_firstname
                              }
                              {" "}
                              {
                                selectedContact?.userProfile.users_lastname
                              }
                            </Text>
                          </View>
                        </LinearGradient>
                      </ImageBackground>
                    </View>
                  )
                  }
                </View>
                : selectedContact?.userProfile.users_image === null &&
                <View style={styles.modalHeaderNoImage}>
                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(255,255,255,0)",
                      "rgba(0,0,0,0.5)",
                    ]}
                    locations={[0.4, 0.4]}
                    style={
                      styles.linearBackground
                    }
                  >
                    <View style={styles.googleImage}>
                      <View className="w-36 h-36">
                      </View>
                      <Text className="text-center text-white text-3xl font-semibold">
                        {
                          selectedContact?.userProfile.username
                        }
                      </Text>
                      <Text className="text-center text-white text-xl pb-7">
                        {
                          selectedContact?.userProfile.users_firstname
                        }
                        {" "}
                        {
                          selectedContact?.userProfile.users_lastname
                        }
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              }
              {modalType === "myCard" &&
                <View style={styles.myCardOptionContainer}>
                  <TouchableOpacity style={styles.myCardOptions} >
                    <Text>Edit profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.myCardOptions} onPress={() => navigateToShareProfile()}>
                    <Text>Share pontact</Text>
                  </TouchableOpacity>
                </View>
              }
              {selectedContact?.userProfile.users_phone !== null &&
                <View style={styles.modalDetail}>
                  <Text className="pb-3">Phone</Text>
                  <TouchableOpacity onPress={() => openCall(selectedContact.userProfile.users_phone)} className="flex-row items-center">
                    <Text>{selectedContact?.userProfile.users_phone}</Text>
                  </TouchableOpacity>
                </View>
              }
              <View style={styles.modalDetail}>
                <Text className="pb-3">Email</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => openMail(selectedContact?.userProfile.users_email)}>
                    <Text className="text-[#3288BD]">{selectedContact?.userProfile.users_email}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copyToClipboard(selectedContact?.userProfile.users_email)}>
                    <Image className="w-4 h-4 ml-2" source={require("@/assets/icons/document-copy-icon.png")} />
                  </TouchableOpacity>
                </View>
              </View>
              {selectedContact?.userSocials.length > 0 &&
                <View style={styles.modalDetail}>
                  <Text className="pb-3">Socials</Text>
                  {selectedContact?.userSocials.map((item, index) => (
                    <View key={index} className="flex-row my-2 items-center">
                      <Image
                        source={
                          item.socialPlatform === "Instagram" ? require("@/assets/icons/instagram-icon.png") :
                            item.socialPlatform === "X" ? require("@/assets/icons/twitter-icon.png") :
                              item.socialPlatform === "LinkedIn" ? require("@/assets/icons/linkedin-icon.png") :
                                item.socialPlatform === "Facebook" ? require("@/assets/icons/facebook-icon.png") :
                                  require("@/assets/icons/internet-icon.png")
                        }
                        style={styles.platformIcon}
                      />

                      <View style={{ marginLeft: 8 }}>
                        <OpenURLButton url={item.socialLink}>{item.socialLink}</OpenURLButton>
                      </View>
                    </View>
                  ))}
                </View>
              }
            </View>
          </BottomSheetScrollView>

        </BottomSheet>
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
