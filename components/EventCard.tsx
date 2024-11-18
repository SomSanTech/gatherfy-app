import React, { useEffect, useState } from "react";
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

  const { slug , setSlug } = useAppContext();

  const navigation = useNavigation<any>();

  const navigateToEventDetail = (value: string) => {
    setSlug(value);
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
        url += `?keyword=${search}`;
        const response = await fetch(url);
        const data = await response.json();
        setEvents(data);
        setIsLoading(false);
      } else if (page === "search" && !search) {
        setEvents([]);
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
    <FlatList
      data={events}
      keyExtractor={(item) => item.slug}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.slug}
          onPress={() => navigateToEventDetail(item.slug)}
        >
          <View className="mx-4 mt-5 bg-white p-4 rounded-lg w-100 flex-row  items-center ">  
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
  );
};

export default EventCard;
