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
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import formatDate from "@/utils/formatDate";
import Icon from "react-native-vector-icons/Ionicons";

interface Event {
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  tags: { tag_id: number; tag_title: string; tag_code: string }[];
  image: string;
  location: string;
}

interface EventCardProps {
  page: string;
  events: Event[];
  search?: string;
  isSearched?: boolean;
  setIsSearched?: (value: boolean) => void;
  isLoading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  page,
  events,
  search,
  isSearched,
  setIsSearched,
  isLoading,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const { navigateToEventDetail } = useNavigateToEventDetail();

  useEffect(() => {
    console.log(page);

    if (page === "search") {
      if (search && isSearched) {
        setIsSearched && setIsSearched(true);
      } else {
      }
    }
  }, [isLoading]);

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.slug}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" // สำคัญ!
      contentContainerStyle={{
        paddingBottom: 20,
        marginTop: 0,
        flexGrow: 1, // ทำให้ข้อความอยู่ตรงกลาง
      }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          key={item.slug}
          onPress={() => navigateToEventDetail(item.slug)}
          className="items-center justify-center"
          style={[
            styles.cardContainer,
            {
              marginTop:
                page === "tag" && index === 0 ? 25 : index === 0 ? 5 : 20,
            },
          ]}
        >
          <View className=" bg-white p-4 h-52 rounded-lg flex-row">
            <View className="w-[39%] mr-4">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 justify-between pb-5 overflow-hidden">
              <View>
                <Text
                  className="text-xl w-full text-primary font-Poppins-SemiBold"
                  style={{ maxWidth: "100%" }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </View>
              <View>
                <Text style={[styles.detailTag]}>
                  {item.tags.map((tag) => tag.tag_title).join(", ")}
                </Text>

                <View style={[styles.detailContainer]}>
                  <Icon name="calendar-outline" size={18} color="#000000" />
                  <Text
                    style={[styles.detail]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatDate(item.start_date, true).date} -{" "}
                    {formatDate(item.end_date, true).date}
                  </Text>
                </View>
                <View style={[styles.detailContainer]}>
                  <Icon name="time-outline" size={20} color="#000000" />
                  <Text
                    style={[styles.detail]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatDate(item.start_date, true).time} -{" "}
                    {formatDate(item.end_date, true).time}
                  </Text>
                </View>
                <View style={[styles.detailContainer]}>
                  <Icon name="map-outline" size={20} color="#000000" />
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
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        isSearched && events ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              Can't Find Events You're Looking For
            </Text>
          </View>
        ) : page === "tag" && events ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              Can't Find Events You're Looking For
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    borderRadius: 10, // มุมโค้งมน
    backgroundColor: "#FFFFFF", // พื้นหลังของการ์ด
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.17,
    shadowRadius: 5,
    elevation: 6,
  },
  detailContainer: {
    flexDirection: "row",
    width: "98%",
    alignItems: "center",
    marginTop: 2,
  },
  detailTag: {
    fontSize: 15,
    lineHeight: 20,
    color: "#4B5563",
    fontFamily: "Poppins-Regular",
  },
  detail: {
    fontSize: 13,
    lineHeight: 20,
    color: "#4B5563",
    width: "90%",
    marginLeft: 5,
    fontFamily: "Poppins-Regular",
  },
});

export default EventCard;
