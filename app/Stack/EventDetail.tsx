import React, { Fragment, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Ionicons";
import WebView from "react-native-webview";
import Popup from "@/components/PopUp";
import CustomButton from "@/components/CustomButton";
import * as SecureStore from "expo-secure-store";
import { fetchUserProfile } from "@/composables/useFetchUserProfile";
import { useFetchTicketWithAuth } from "@/composables/useFetchTicket";
import { countViewById, getEvent } from "@/composables/getEvent";
import formatDate from "@/utils/formatDate";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import { Colors } from "@/constants/Colors";
import useNavigateToEventTag from "@/composables/navigateToEventTag";
import Favorite from "@/assets/icons/favorite-icon.svg";
import FavoriteFill from "@/assets/icons/favorite-fill-icon.svg";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { addFavortite, fetchFavortite, RemoveFavortite } from "@/composables/useFetchFavorite";
import Loader from "@/components/Loader";

type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;

type EventDetailProps = {
  route: EventDetailRouteProp;
};

interface EventDetail {
  eventId: string;
  slug: string;
  name: string;
  date: string;
  detail: string;
  start_date: string;
  end_date: string;
  ticket_start_date: string;
  ticket_end_date: string;
  tags: { tag_id: number; tag_title: string; tag_code: string }[];
  image: string;
  owner: string;
  location: string;
  map: string;
  status: string;
}

const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const { slug } = route.params;
  const { navigateToGoBack } = useNavigateToGoBack();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteId, setFavoriteId] = useState<number | null>();
  const [closeRegister, setCloseRegister] = useState<boolean>(false);
  const [closeRegisterText, setCloseRegisterText] =
    useState<string>("Register Event");
  const [usersInfo, setUsersInfo] = useState<any>([]);
  const [confirmRegister, setConfirmRegister] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { navigateToEventTag } = useNavigateToEventTag();

  const fetchDataDetailAsync = async () => {
    const response = await getEvent("detail", undefined, slug);
    setEventDetail(response);
  };

  const validateTimeRegister = async () => {
    const currentDate = new Date();
    const startDate = new Date(eventDetail.ticket_start_date);
    const endDate = new Date(eventDetail.ticket_end_date);

    if (currentDate < startDate) {
      setCloseRegister(true);
      setCloseRegisterText("Coming Soon");
    } else if (eventDetail.status !== 'full' && currentDate > endDate) {
      setCloseRegister(true);
      setCloseRegisterText("Registration Closed");
    } else if (eventDetail.status === 'full') {
      setCloseRegister(true);
      setCloseRegisterText("Registration Full");
    } else {
      setCloseRegister(false);
      setCloseRegisterText("Join Event");
    }
  };

  const getUsersInfo = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const response = await fetchUserProfile(token, "/v1/profile", "GET");
    setUsersInfo(response);
  };

  const handleAddToFavorite = async (eventId: string) => {
    const token = await SecureStore.getItemAsync("my-jwt");
    console.log(eventId)
    const favortiteBody = {
      eventId: eventId,
    };
    const response = await addFavortite(token, favortiteBody)
    setIsFavorite(true)
    setFavoriteId(response.favoriteId)
  }

  const handleRemoveFavorite = async (eventId: any) => {
    const token = await SecureStore.getItemAsync("my-jwt");
    console.log(favoriteId)
    const response = await RemoveFavortite(token, eventId)
    setIsFavorite(false)
    setFavoriteId(null)
  }

  useEffect(() => {
    setIsLoading(true)
    try {
      const fetchRegistrationAndFavorite = async () => {
        const token = await SecureStore.getItemAsync("my-jwt");
        const response = await useFetchTicketWithAuth("v1/tickets", "GET", token);
        setIsRegistered(
          response.some(
            (ticket: { slug: string }) => ticket.slug === eventDetail.slug
          )
        );
        const favResponse = await fetchFavortite(token);
        favResponse.forEach((fav: any) => {
          if (fav.eventId === eventDetail.eventId) {
            setIsFavorite(true)
            setFavoriteId(fav.favoriteId)
          }
        })
      };
      fetchRegistrationAndFavorite();
      validateTimeRegister();
      fetchDataDetailAsync();
      getUsersInfo();

      // Only call countViewById when eventDetail.eventId is available
      if (eventDetail.eventId) {
        countViewById(`/api/v1/countView/${eventDetail.eventId}`);
      }
    } finally {
        setIsLoading(false)
        console.log(imageLoaded)
        
    }
  }, [eventDetail.slug, confirmRegister, eventDetail.eventId, isFavorite]); // Add eventDetail.eventId to the dependency array
  useEffect(() => {
    console.log("ImageLoaded state:", imageLoaded);
  }, [imageLoaded]);
  const startDate = eventDetail.start_date
    ? formatDate(eventDetail.start_date, true, true, true).date
    : "";
  const endDate = eventDetail.end_date
    ? formatDate(eventDetail.end_date, true, true, true).date
    : "";
  const startTime = eventDetail.start_date
    ? formatDate(eventDetail.start_date, true).time
    : "";
  const endTime = eventDetail.end_date
    ? formatDate(eventDetail.end_date, true).time
    : "";

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        {isLoading ? (
          <Loader />
        ) : (
          <KeyboardAwareScrollView>
            <View style={styles.imageContainer}>
              <ImageBackground
                className="w-full h-full"
                blurRadius={40}
                source={{
                  uri: eventDetail.image,
                }}
              >
                <TouchableOpacity className="absolute top-4 left-2" onPress={() => navigateToGoBack()}>
                  <Icon name="chevron-back" size={26} color="#000000" />
                </TouchableOpacity>
                <Image
                  source={{ uri: eventDetail.image }}
                  style={styles.image}
                  resizeMode="contain"
                  onLoadEnd={() => setImageLoaded(true)}
                />
                <Text className="absolute bottom-4 right-2">Join Event</Text>
              </ImageBackground>
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.tagsContainer}>
                {eventDetail.tags?.map((tag) => (
                  <TouchableOpacity
                    key={tag.tag_id}
                    style={styles.tagBox}
                    onPress={() => navigateToEventTag(tag.tag_title, tag.tag_id)}
                  >
                    <View style={styles.tagTextContainer}>
                      <Text style={styles.tagText}>{tag.tag_title}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.eventName}>{eventDetail.name}</Text>
              <View className="flex-row mt-2">
                <Text className=""><Text className="opacity-50">Organized by</Text> {eventDetail.owner}</Text>
              </View>
              <View style={styles.eventDetail} className="">
                <View className="flex-row">
                  <Icon name="calendar-outline" size={20} color="#626567" />
                  <Text className="font-semibold mx-2">
                    {startDate}{" "}
                    {eventDetail.end_date && eventDetail.end_date.length > 0 ? (
                      <Text>- {endDate}</Text>
                    ) : (
                      <Text>No end date</Text>
                    )}
                  </Text>
                </View>
                <View className="flex-row">
                  <Icon name="time-outline" size={20} color="#626567" />
                  <Text className="font-semibold mx-2">
                    {startTime} - {endTime}
                  </Text>
                </View>
                <View className="flex-row">
                  <Icon name="map-outline" size={20} color="#626567" />
                  <Text className="font-semibold mx-2">
                    {eventDetail.location}
                  </Text>
                </View>
              </View>
              <View className="flex-row w-[98%] self-center justify-between bg-transparent mt-4">
                <View style={{ width: '46%' }}>
                  {isFavorite ? (
                    <CustomButton
                      title="Favorited"
                      IconComponent={<FavoriteFill width={20} height={20} color={'#D71515'} />}
                      containerStyles={styles.alreadyFavButton}
                      textStyle={styles.alreadyFavButtonText}
                      handlePress={() => { handleRemoveFavorite(eventDetail.eventId) }}
                      disabled={false} />
                  ) : (
                    <CustomButton
                      title="Add to Favorites"
                      IconComponent={<Favorite width={20} height={20} color={'black'} />}
                      containerStyles={styles.favButton}
                      textStyle={styles.favButtonText}
                      handlePress={() => { handleAddToFavorite(eventDetail.eventId) }}
                      disabled={false} />
                  )
                  }
                </View>
                <View style={{ width: '52%' }}>
                  {isRegistered ? (
                    <CustomButton
                      title="Already Registered"
                      containerStyles={styles.registerButtonDisabled}
                      textStyle={styles.registerButtonTextDisabled}
                      handlePress={() => { }}
                      disabled={true}
                    />
                  ) : (
                    <CustomButton
                      title={closeRegisterText}
                      containerStyles={
                        closeRegister
                          ? styles.registerButtonDisabled
                          : styles.registerButton
                      }
                      textStyle={
                        closeRegister
                          ? styles.registerButtonTextDisabled
                          : styles.registerButtonText
                      }
                      handlePress={() => setPopupVisible(true)}
                      disabled={closeRegister}
                    />
                  )}
                </View>
              </View>
              <View style={styles.modalDetail} className="">
                <Text style={styles.descriptionTitle}>About</Text>
                <Text style={styles.descriptionText}>{eventDetail.detail}</Text>
              </View>
              <View style={styles.modalDetail} className="">
                <Text style={styles.mapTitle}>Location</Text>
                <WebView
                  scalesPageToFit={true}
                  bounces={false}
                  javaScriptEnabled
                  style={styles.map}
                  automaticallyAdjustContentInsets={false}
                  source={{
                    html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    html, body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                    }
                    iframe {
                      border: 0;
                      border-radius: 50px;
                      width: 100%;
                      height: 100%;
                    }
                  </style>
                </head>
                <body>
                  ${eventDetail.map}
                </body>
              </html>
            `,
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaView>
      <Popup
        visible={isPopupVisible}
        onClose={() => setPopupVisible(false)}
        title="Registration"
        eventName={eventDetail.name}
        eventLocation={eventDetail.location}
        startDate={startDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        eventId={eventDetail.eventId}
        user={usersInfo}
        setConfirmRegister={setConfirmRegister}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 420,

  },
  image: {
    width: "90%",
    height: "90%",
    // borderRadius: 10,
    margin: "auto",
    objectFit: "contain",
  },
  detailContainer: {
    padding: 15,
    paddingVertical: 20,
    // backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 25,
  },
  eventName: {
    fontSize: 22,
    includeFontPadding: false,
    fontFamily: "Poppins-Bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 1,
    marginBottom: 15,
  },
  tagBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tagTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 5,
  },
  tagText: {
    includeFontPadding: false,
    fontFamily: "Poppins-SemiBold",
    fontSize: wp(3),
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#D71515",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#D71515",
    borderWidth: 1,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  registerButtonDisabled: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#CCCCCC",
    borderWidth: 1,
  },
  registerButtonTextDisabled: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  descriptionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    lineHeight: 24,
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 10,
  },
  map: {
    height: 400,
    width: "100%",
    backgroundColor: "#f5f5f5",
    // borderRadius: 30
  },
  modalDetail: {
    marginTop: 20,
    // marginHorizontal: 2,
    paddingHorizontal: 5,
    paddingVertical: 18,
    // backgroundColor: "#F9FBFC",
    borderRadius: 20,
    gap: 10,
    borderColor: '#ECECEC',
    // borderWidth: 1
  },
  eventDetail: {
    marginTop: 20,
    // marginHorizontal: 2,
    paddingHorizontal: 5,
    paddingVertical: 18,
    // backgroundColor: "#F9FBFC",
    borderRadius: 20,
    gap: 10,
    borderColor: '#ECECEC',
    // borderWidth: 1
  },
  favButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4
  },
  favButtonText: {
    color: "#000",
    fontFamily: "Poppins",
  },
  alreadyFavButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#D71515",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4
  },
  alreadyFavButtonText: {
    color: "#D71515",
    fontFamily: "Poppins",
  },
});

export default EventDetail;
