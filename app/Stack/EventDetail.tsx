import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import RootStackParamList from "@/rootStack/RootStackParamList";
import Constants from "expo-constants";
import { getEvent } from "@/composables/getEvent";
import formatDate from "@/utils/formatDate";

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
  location: string;
}

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'https://capstone24.sit.kmutt.ac.th'


const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const { slug } = route.params;
  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );


  const fetchDataDetailAsync = async () => {
    const response = await getEvent('detail', undefined ,slug);
    setEventDetail(response);
  };

  useEffect(() => {
    fetchDataDetailAsync();
  }, []);

  const startDate = formatDate(eventDetail.start_date,false).date;
  const endDate = formatDate(eventDetail.end_date,false).date;
  const startTime = formatDate(eventDetail.start_date,false).time;
  const endTime = formatDate(eventDetail.end_date,false).time;

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="p-4 pt-2 bg-white shadow">
        <Text className="text-xl font-bold">Event Detail</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="w-full h-80">
          <Image
            source={{ uri: eventDetail.image }}
            className="w-full h-full rounded-lg"
            resizeMode="contain"
          />
        </View>
        <View className="p-3 pb-0">
          {eventDetail.tags && eventDetail.tags.length > 0 ? (
            <Text>{eventDetail.tags.join(", ")}</Text>
          ) : (
            <Text>No tags available</Text>
          )}
          <Text className="text-xl font-bold">{eventDetail.name}</Text>
          <Text>{startDate}</Text>
          {eventDetail.end_date && eventDetail.end_date.length > 0 ? (
            <Text>{endDate}</Text>
          ) : (
            <Text>No end date</Text>
          )}
          <Text>
            {startTime} - {endTime}
          </Text>
          <Text>{eventDetail.location}</Text>
        </View>
        <View className="p-3 pb-0">
          <Text className="text-lg font-bold ">Event Detail</Text>
          <Text className="">{eventDetail.detail}</Text>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default EventDetail;
