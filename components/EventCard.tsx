import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import { useAppContext } from "./AppContext";
import EventDetail from "@/app/stack/EventDetail";
import Constants from "expo-constants";
import { fetchData } from "@/composables/getEvent";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";

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
  search?: string;
  event?: Event;
}

const EventCard: React.FC<EventCardProps> = ({ page, search, event }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const { isLoading, setIsLoading } = useAppContext();
  const { countResult, setCountResult } = useAppContext();
  const screenWidth = Dimensions.get("window").width;

  const fetchDataAsync = async () => {
    if (page === "home") {
      const data = await fetchData(page);
      setEvents(data);
    }
    if (page === "search" && search) {
      const data = await fetchData(page, search);
      console.log(search);

      setEvents(data);
      setIsLoading(false);
      setCountResult(data.length);
    } else if (page === "search" && !search) {
      console.log(search);
      setEvents([]);
      setCountResult(0);
      setIsLoading(false);
      return;
    }
  };

  const { navigateToEventDetail } = useNavigateToEventDetail();

  useEffect(() => {
    fetchDataAsync();
    console.log("EventCard useEffect");
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
        horizontal={page === "home"}
        pagingEnabled={page === "home"}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 0,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.slug}
            onPress={() => navigateToEventDetail(item.slug)}
          >
            <View
              className="mx-4 mb-5 bg-white p-4 rounded-lg flex-row  items-center "
              style={{ width: screenWidth - 40 }}
            >
              <View className="w-32 mr-5">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-40 rounded-lg"
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
