import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import formatDate from "@/utils/formatDate";
import Calendar from "../assets/icons/Calendar.svg"
import Location from "../assets/icons/Location.svg"
import Time from "../assets/icons/Time.svg"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
interface Event {
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  ticket_start_date: string;
  ticket_end_date: string;
  tags: { tag_id: number; tag_title: string; tag_code: string }[];
  image: string;
  location: string;
  status: string;
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
  const { navigateToEventDetail } = useNavigateToEventDetail();
  const handleEventStatus = (event: Event) => {
    const currentDate = new Date();
    const startDate = new Date(event.ticket_start_date);
    const endDate = new Date(event.ticket_end_date);

    if (currentDate < startDate) {
      return "SOON"
    } else if (event.status !== 'full' && currentDate > endDate) {
      return" CLOSED";
    } else if (event.status === 'full') {
      return"FULL";
    } else {
      return"NOW";
    }
  }
  useEffect(() => {
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
            {
              marginTop:
                page === "tag" && index === 0 ? 15 : index === 0 ? 5 : 10,
            },
          ]}
        >
          <View className="bg-white p-4 rounded-lg flex-row" style={{ height: Platform.OS === "ios" ? 220 : 260 }}>
            <View className="w-[39%] mr-4">
              <ImageBackground
                source={{ uri: item.image }}
                className="w-full h-full overflow-hidden rounded-lg"
              >
                { page === 'tag' ? (
                <View style={styles.statusBox} className="absolute top-3 left-3">
                <Text className="font-Poppins-SemiBold text-white" style={{fontSize: 9, includeFontPadding: false}}>
                  { handleEventStatus(item) }
                  </Text>
              </View>
                ): null }
              </ImageBackground>
            </View>
            <View className="flex-1 justify-between pb-5 overflow-hidden">
              <View>
                <Text
                  className="w-full text-black font-Poppins-SemiBold"
                  style={{fontSize: Platform.OS === "ios" ? wp("4.3") : wp("3.4"), maxWidth: "100%" }}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
              </View>
              <View>
                <Text style={[styles.detailTag]} numberOfLines={1}>
                  {item.tags.map((tag) => tag.tag_title).join(", ")}
                </Text>

                <View style={[styles.detailContainer]}>
                  <Calendar width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#4B5563" strokeWidth={10}/>
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
                  <Time width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#4B5563" />
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
                  <Location width={Platform.OS === "ios" ? 20 : 22} height={Platform.OS === "ios" ? 20 : 22} color="#4B5563" />
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
  detailContainer: {
    flexDirection: "row",
    width: "98%",
    alignItems: "center",
    marginTop: 2,
  },
  detailTag: {
    fontSize: Platform.OS === "ios" ? 15 : 14,
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
    includeFontPadding: false
  },
  statusBox:{
    backgroundColor: "#ea2929",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12
  },
});

export default EventCard;
