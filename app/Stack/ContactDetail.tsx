import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, Clipboard, ScrollView, ImageBackground, Image } from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";

type ContactDetailScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "ContactDetail">;
  route: RouteProp<RootStackParamList, "ContactDetail">;
};

const ContactDetail: React.FC<ContactDetailScreenProps> = ({ route }) => {
  const { contactData } = route.params || {};
  console.log("Route Params:", contactData.response.userProfile);
  const navigation = useNavigation();

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
  
  const replaceSocialLink = (url: string) => {
    return url.replace(/(?:https?:\/\/)?(?:www\.)?(?:x\.com\/|facebook\.com\/|instagram\.com\/|linkedin\.com\/)([\w.]+)/, "@$1");
  }

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


  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* ปุ่มย้อนกลับ */}
      {/* <View style={styles.backButtonContainer}> */}
          {/* <TouchableOpacity onPress={() => navigation.goBack()} className="absolute">
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity> */}
        {/* </View> */}
      <View style={styles.contactContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute z-50 top-2 left-2">
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
        <ScrollView className="pb-10">
          {contactData.response.userProfile.users_image ?
            <View
              style={
                styles.contactHeader
              }
            >
              {contactData.response.userProfile.auth_provider === "system" ? (
                <ImageBackground
                  className="w-full h-full"
                  style={
                    styles.systemImage
                  }
                  source={{
                    uri: contactData.response.userProfile.users_image,
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
                        contactData.response.userProfile.username
                      }
                    </Text>
                    <Text className="text-center text-white text-xl pb-7">
                      {
                        contactData.response.userProfile.users_firstname
                      }
                      {" "}
                      {
                        contactData.response.userProfile.users_lastname
                      }
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              ) : contactData.response.userProfile.auth_provider === "google" && (
                <View style={styles.modalHeader}>
                  <ImageBackground
                    className="w-full h-full"
                    blurRadius={3}
                    source={{
                      uri: contactData.response.userProfile.users_image,
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

                        <Image source={{ uri: contactData.response.userProfile.users_image }} className="w-36 h-36 rounded-full" />
                        <Text className="text-center text-white text-3xl font-semibold">
                          {
                            contactData.response.userProfile.username
                          }
                        </Text>
                        <Text className="text-center text-white text-xl pb-7">
                          {
                            contactData.response.userProfile.users_firstname
                          }
                          {" "}
                          {
                            contactData.response.userProfile.users_lastname
                          }
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              )
              }
            </View>
            : contactData.response.userProfile.users_image === null &&
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
                      contactData.response.userProfile.username
                    }
                  </Text>
                  <Text className="text-center text-white text-xl pb-7">
                    {
                      contactData.response.userProfile.users_firstname
                    }
                    {" "}
                    {
                      contactData.response.userProfile.users_lastname
                    }
                  </Text>
                </View>
              </LinearGradient>
            </View>
          }
          {contactData.response.userProfile.users_phone !== null &&
            <View style={styles.modalDetail}>
              <Text className="pb-3">Phone</Text>
              <TouchableOpacity onPress={() => openCall(contactData.response.userProfile.users_phone)} className="flex-row items-center">
                <Text>{contactData.response.userProfile.users_phone}</Text>
              </TouchableOpacity>
            </View>
          }
          <View style={styles.modalDetail}>
            <Text className="pb-3">Email</Text>
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => openMail(contactData.response.userProfile.users_email)}>
                <Text className="text-[#3288BD]">{contactData.response.userProfile.users_email}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => copyToClipboard(contactData.response.userProfile.users_email)}>
                <Image className="w-4 h-4 ml-2" source={require("@/assets/icons/document-copy-icon.png")} />
              </TouchableOpacity>
            </View>
          </View>
          {contactData.response.userSocials.length > 0 &&
            <View style={styles.modalDetail}>
              <Text className="pb-3">Socials</Text>
              {contactData.response.userSocials.map((item, index) => (
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
        </ScrollView>
      </View>

    </SafeAreaView>
  );
};

export default ContactDetail;

const styles = StyleSheet.create({
  backButtonContainer: {
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Poppins-Regular",
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginLeft: 16,
    includeFontPadding: false,
  },
  contactId: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginLeft: 16,
  },
  contactContainer: {
    backgroundColor: "#F6F6F6",
    shadowColor: "black",
    shadowOffset: { width: 0, height: -20 },
    textShadowRadius: 10,
    shadowRadius: 15,
    shadowOpacity: 0.1,
    height: "100%",
  },
  contactHeader: {
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
});
