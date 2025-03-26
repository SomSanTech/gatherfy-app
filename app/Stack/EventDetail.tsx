import React, { Fragment, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
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
import { getEvent } from "@/composables/getEvent";
import formatDate from "@/utils/formatDate";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import { Colors } from "@/constants/Colors";
import useNavigateToEventTag from "@/composables/navigateToEventTag";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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
  tags: { tag_id: number; tag_title: string; tag_code: string }[];
  image: string;
  owner: string;
  location: string;
  map: string;
}

const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const { slug } = route.params;
  const { navigateToGoBack } = useNavigateToGoBack();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [usersInfo, setUsersInfo] = useState<any>([]);
  const [confirmRegister, setConfirmRegister] = useState<boolean>(false);

  const { navigateToEventTag } = useNavigateToEventTag();

  const fetchDataDetailAsync = async () => {
    const response = await getEvent("detail", undefined, slug);
    setEventDetail(response);
  };

  const getUsersInfo = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const response = await fetchUserProfile(token, "/v1/profile", "GET");
    setUsersInfo(response);
  };

  useEffect(() => {
    setConfirmRegister(false);
    console.log("confirmRegister", confirmRegister);

    const fetchRegistration = async () => {
      const token = await SecureStore.getItemAsync("my-jwt");
      const response = await useFetchTicketWithAuth("v1/tickets", "GET", token);
      setIsRegistered(
        response.some(
          (ticket: { slug: string }) => ticket.slug === eventDetail.slug
        )
      );
    };
    fetchRegistration();
    fetchDataDetailAsync();
    getUsersInfo();
  }, [eventDetail.slug, confirmRegister]);

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
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigateToGoBack()}>
            <Icon name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Event Detail</Text>
        </View>
        <KeyboardAwareScrollView>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: eventDetail.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.eventName}>{eventDetail.name}</Text>
            {/* <View style={styles.tagsContainer}>
              {eventDetail.tags?.length > 0 && (
                <Text style={styles.tagsText}>
                  {eventDetail.tags.map((tag) => tag.tag_title).join(", ")}
                </Text>
              )}
            </View> */}
            <View style={styles.tagsContainer}>
              {eventDetail.tags?.map((tag) => (
                <TouchableOpacity
                  key={tag.tag_id}
                  style={styles.tagBox}
                  onPress={() => navigateToEventTag(tag.tag_title , tag.tag_id)}
                >
                  <View style={styles.tagTextContainer}>
                    <Text style={styles.tagText}>{tag.tag_title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.dateContainer}>
              <Icon name="calendar-outline" size={20} color="#000000" />
              <Text style={styles.dateText}>
                {startDate}{" "}
                {eventDetail.end_date && eventDetail.end_date.length > 0 ? (
                  <Text>- {endDate}</Text>
                ) : (
                  <Text>No end date</Text>
                )}
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="time-outline" size={20} color="#000000" />
              <Text style={styles.timeText}>
                {startTime} - {endTime}
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <Icon name="map-outline" size={20} color="#000000" />
              <Text style={styles.locationText}>{eventDetail.location}</Text>
            </View>
            <View style={styles.registerButtonContainer}>
              {isRegistered ? (
                <CustomButton
                  title="Already Registered"
                  containerStyles={styles.registerButtonDisabled}
                  textStyle={styles.registerButtonTextDisabled}
                  handlePress={() => {}}
                  disabled={true}
                />
              ) : (
                <CustomButton
                  title="Register event"
                  containerStyles={styles.registerButton}
                  textStyle={styles.registerButtonText}
                  handlePress={() => setPopupVisible(true)}
                />
              )}
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{eventDetail.detail}</Text>
          </View>
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Event Location</Text>
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
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerText}>Organized by</Text>
            <Text style={styles.organizerName}>{eventDetail.owner}</Text>
          </View>
        </KeyboardAwareScrollView>
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
  imageContainer: {
    width: "100%",
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  detailContainer: {
    padding: 15,
    paddingVertical: 20,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 25,
  },
  eventName: {
    fontSize: 24,
    includeFontPadding: false,
    fontFamily: "Poppins-Bold",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  tagBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 6,
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
  tagIconContainer: {
    paddingHorizontal: 7,
  },
  dateContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  timeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  registerButtonContainer: {
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: "#D71515",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  registerButtonDisabled: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  registerButtonTextDisabled: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  descriptionContainer: {
    paddingHorizontal: 15,
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
  mapContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
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
  },
  organizerContainer: {
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  organizerText: {
    fontSize: 14,
    fontFamily: "Poppins-Light",
    textAlign: "center",
  },
  organizerName: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
});

export default EventDetail;
