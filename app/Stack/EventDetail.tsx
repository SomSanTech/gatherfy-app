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
import { API_HOST_IOS, API_HOST_ANDROID } from "@env";
import { RouteProp } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";


type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;


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

const EventDetail: React.FC<EventDetailProps> = ({ route }) => {
  const { slug } = route.params;
  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );
  const fetchData = async () => {
    const apiURL = Platform.OS === "ios" ? API_HOST_IOS : API_HOST_ANDROID;

    let url = `${apiURL}/api/v1/events`;

    try {
      url += `/${slug}`;
      const response = await fetch(url);
      const data = await response.json();
      setEventDetail(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string): { date: string; time: string } => {
    try {
      const date = new Date(dateString);

      // Custom formatted date
      const day = date.getDate(); // Day of the month
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[date.getMonth()]; // Get full month name
      const year = date.getFullYear(); // Full year

      const formattedDate = `${day} ${month} ${year}`;

      // Time in HH:MM AM/PM format
      const hours = date.getHours();
      const minutes = date.getMinutes();

      const formattedTime = `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2, "0")}`;

      return { date: formattedDate, time: formattedTime };
    } catch (error) {
      console.error("Error formatting date:", error);
      return { date: "Invalid date", time: "" };
    }
  };

  const startDate = formatDate(eventDetail.start_date).date;
  const endDate = formatDate(eventDetail.end_date).date;
  const startTime = formatDate(eventDetail.start_date).time;
  const endTime = formatDate(eventDetail.end_date).time;

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="p-4 pt-2 bg-white shadow">
        <Text className="text-xl font-bold">Event Detail</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="w-full">
          <Image
            source={{ uri: eventDetail.image }}
            className="w-full h-60"
            resizeMode="cover"
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
          <Text className="text-lg font-bold ">Event etail</Text>
          <Text className="">{eventDetail.detail}</Text>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default EventDetail;
