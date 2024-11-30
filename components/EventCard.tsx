import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useAppContext } from "./AppContext";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import formatDate from "@/utils/formatDate";
import truncateText from "@/utils/truncateText";
import { isLoading } from "expo-font";

interface Event {
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  tags: string[];
  image: string;
  location: string;
}

interface EventCardProps {
  page: string;
  events: Event[];
  search?: string;
  isLoading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  page,
  events,
  search,
  isLoading,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const { navigateToEventDetail } = useNavigateToEventDetail();
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    if (page === "search") {
      if (search) {
        setIsSearched(true);
      } else {
        setIsSearched(false);
      }
    }
  }, [isLoading]);

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.slug}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
        marginTop: 20,
        flexGrow: 1, // ทำให้ข้อความอยู่ตรงกลาง
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.slug}
          onPress={() => navigateToEventDetail(item.slug)}
          className="items-center justify-center"
        >
          <View
            className="mb-5 bg-white p-4 h-52 rounded-lg flex-row"
            style={{ width: screenWidth - 40 }}
          >
            <View className="w-[45%] mr-4">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-between pb-5 overflow-hidden">
              <View>
                <Text
                  className="text-xl w-full font-bold text-primary"
                  style={{ maxWidth: "100%" }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </View>
              <View>
                <Text style={[styles.detail]}>{item.tags.join(", ")}</Text>
                <Text style={[styles.detail]}>
                  {formatDate(item.start_date, true).date} -{" "}
                  {formatDate(item.end_date, true).date}
                </Text>
                <Text style={[styles.detail]}>
                  {formatDate(item.start_date, true).time} -{" "}
                  {formatDate(item.end_date, true).time}
                </Text>
                <Text
                  style={[styles.detail]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.location}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        isSearched && events ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              No results found
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  detail: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
});

export default EventCard;
