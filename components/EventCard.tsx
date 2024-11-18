import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useAppContext } from "./AppContext";
import { useNavigation } from "@react-navigation/native";
import EventDetail from "@/app/Stack/EventDetail";
import { API_HOST_IOS, API_HOST_ANDROID } from "@env";
import { set } from "date-fns";

interface Event {
  slug: string;
  name: string;
  date: string;
  tags: string[];
  image: string;
  location: string;
}

interface EventCardProps {
  page: string;
  search: string;
}

const EventCard: React.FC<EventCardProps> = ({ page, search }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const { isLoading, setIsLoading } = useAppContext();
  const { countResult, setCountResult } = useAppContext();

  const navigation = useNavigation<any>();

  const navigateToEventDetail = (value: string) => {
    navigation.navigate("EventDetail", { slug: value });
  };

  const fetchData = async () => {
    const apiURL = Platform.OS === "ios" ? API_HOST_IOS : API_HOST_ANDROID;
    console.log(apiURL);
    let url = `${apiURL}/api/v1/events`;
    try {
      if (page === "home") {
        const response = await fetch(`${apiURL}/api/v1/events`);
        const data = await response.json();
        setEvents(data);
      }

      if (page === "search" && search) {
 
        const response = await fetch(url);
        const data = await response.json();
        setEvents(data);
        setIsLoading(false);
        setCountResult(data.length);
      } else if (page === "search" && !search) {
        setEvents([]);
        setCountResult(0);
        return;
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoading]);

  return (
    <Fragment>
      {page === "search" && countResult > 0 && (
        <Text className="px-5 pt-4 pb-3 text-sm text-stone-500">
          {countResult === 0 ? "" : `${countResult} `}
          {countResult > 1 ? "Result" : "Results"}
        </Text>
      )}
      <FlatList
        data={events}
        keyExtractor={(item) => item.slug}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: page === "search" ? 0 : 30,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.slug}
            onPress={() => navigateToEventDetail(item.slug)}
          >
            <View className="mx-4 mb-5 bg-white p-4 rounded-lg w-100 flex-row  items-center ">
              <View className="w-32 , mr-5">
                <Image
                  source={{ uri: item.image }}
                  className="w-100 h-40 rounded-lg"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xl w-100 font-bold text-primary">
                  {item.name}
                </Text>
                <Text>{item.tags.join(", ")}</Text>
                <Text>{item.location}</Text>
                {page === "search" && <Text>{search}</Text>}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </Fragment>
  );
};

export default EventCard;
