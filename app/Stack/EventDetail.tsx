import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import RootStackParamList from "@/rootStack/RootStackParamList";
import Constants from "expo-constants";
import { getEvent } from "@/composables/getEvent";
import formatDate from "@/utils/formatDate";
import RegisterForm from "@/components/RegisterForm";
import Icon from "react-native-vector-icons/Ionicons";
import WebView from "react-native-webview";

type EventDetailRouteProp = RouteProp<typeof RootStackParamList, "EventDetail">;

type EventDetailProps = {
  route: EventDetailRouteProp; // Expect the `route` prop
};

interface EventDetail {
  slug: string;
  name: string;
  date: string;
  detail: string;
  start_date: string;
  end_date: string;
  tags: string[];
  image: string;
  owner: string;
  location: string;
  map: string;
}

const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const { slug } = route.params;
  const navigation = useNavigation();
  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );

  const fetchDataDetailAsync = async () => {
    const response = await getEvent("detail", undefined, slug);
    setEventDetail(response);
  };

  useEffect(() => {
    fetchDataDetailAsync();
  }, []);

  const startDate = formatDate(eventDetail.start_date, true , true , true).date;
  const endDate = formatDate(eventDetail.end_date, true,true , true).date;
  const startTime = formatDate(eventDetail.start_date, true).time;
  const endTime = formatDate(eventDetail.end_date, true).time;

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="p-4 pt-2 bg-white shadow">
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text className="text-xl ml-2 font-Poppins-Bold">Event Detail</Text>
        </View>
      </SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="w-full mb-5">
          <View className="w-full h-72">
            <Image
              source={{ uri: eventDetail.image }}
              className="w-full h-full rounded-lg"
              resizeMode="contain"
            />
          </View>
          <View className="p-4 px-5 pb-6 bg-grayBackground">
            <View className="mb-1">
              {eventDetail.tags && eventDetail.tags.length > 0 ? (
                <Text className="font-Poppins-Light">{eventDetail.tags.join(", ")}</Text>
              ) : (
                <Text className="font-Poppins-Light">No tags available</Text>
              )}
            </View>
            <Text className="text-2xl mb-3 font-Poppins-Bold">{eventDetail.name}</Text>
            <View className="mb-2 flex-row">
              <Icon name="calendar-outline" size={20} color="#000000" />
              <Text className="ml-2 font-Poppins-Regular">
                {startDate}{" "}
                {eventDetail.end_date && eventDetail.end_date.length > 0 ? (
                  <Text>- {endDate}</Text>
                ) : (
                  <Text className="font-Poppins-Regular">No end date</Text>
                )}
              </Text>
            </View>
            <View className="mb-2 flex-row">
              <Icon name="time-outline" size={20} color="#000000" />
              <Text className="ml-2 font-Poppins-Regular">
                {startTime} - {endTime}
              </Text>
            </View>
            <View className="mb-2 flex-row">
              <Icon name="map-outline" size={20} color="#000000" />
              <Text className="ml-2 font-Poppins-Regular items-center">{eventDetail.location}</Text>
            </View>
            <View className="mt-3 mb-2">
              <RegisterForm
                start_date={eventDetail.start_date}
                end_date={eventDetail.end_date}
              />
            </View>
          </View>
          <View className="px-5 py-3 mt-3">
            <Text className="text-lg font-semibold mb-2 font-Poppins-SemiBold">Description</Text>
            <Text className="leading-5 font-Poppins-Regular">{eventDetail.detail}</Text>
          </View>
          <View className="px-2 m-3 py-5 pt-2 rounded-xl">
            <Text className="text-lg font-Poppins-SemiBold mb-3">
              Event Location
            </Text>
            <WebView
              scalesPageToFit={true}
              bounces={false}
              javaScriptEnabled
              style={{ height: 400, width: "100%", backgroundColor: "transparent"}}
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
          <View className="p-5 m-4 mt-2 border rounded-2xl">
            <Text className="text-sm text-center font-Poppins-Light">Organized by</Text>
            <Text className="text-lg text-center font-Poppins-SemiBold"> {eventDetail.owner}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default EventDetail;
