import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-elements";
import Svg, { Path } from "react-native-svg";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import useNavigateToReview from "@/composables/navigateToReview";
import { Ionicons } from "@expo/vector-icons";
import formatDate from "@/utils/formatDate";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import useNavigateToTicketDetail from "@/composables/navigateToTicketDetail";

interface Ticket {
  registrationId: number;
  eventId: number;
  name: string;
  image: string;
  slug: string;
  start_date: string;
  end_date: string;
  location: string;
}
interface TicketProps {
  item: Ticket;
}

const TicketCard: React.FC<TicketProps> = ({ item }) => {
  const { navigateToReview } = useNavigateToReview();

  const { navigateToEventDetail } = useNavigateToEventDetail();
  const { navigateToTicketDetail } = useNavigateToTicketDetail();

  const { registrationId , eventId, name, image, slug, start_date, end_date, location } = item;

  console.log("ticketId", registrationId);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ticketContainer}
        onPress={() => navigateToEventDetail(slug)}
      >
        <View className="flex-row w-full h-52">
          <View
            className="w-[33%] p-3 h-full relative bg-white justify-center"
            style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
          >
            <View className="w-full h-full justify-between items-center">
              <Image
                source={{ uri: image }}
                className="w-full h-[75%] rounded-md"
                resizeMode="cover"
              />

              <View className="w-full justify-end ">
                <CustomButton
                  title="Review"
                  handlePress={() => navigateToReview(eventId)}
                  containerStyles={{}}
                  textStyle={{ includeFontPadding: false }}
                  classNameContainerStyle="flex-row w-full px-2 py-1  bg-white justify-center items-center border border-black rounded-lg"
                  classNameTextStyle="font-Poppins-Bold text-regular text-center text-black ml-1"
                  IconComponent={
                    <Ionicons
                      name="star-half-outline"
                      size={20}
                      color="black"
                    />
                  }
                />
              </View>
            </View>
            <View style={styles.dashedLineContainer2}>
              {Array.from({ length: 25 }).map((_, index) => (
                <View key={index} style={styles.dash} />
              ))}
            </View>
          </View>

          <View
            style={styles.ticketContent}
            className="w-[54%] items-start justify-around"
          >
            <Text
              style={styles.ticketTitle}
              numberOfLines={3}
              className="text-xl font-Poppins-Bold"
            >
              {name}
            </Text>
            <View className="justify-center items-start">
              <Text
                style={styles.ticketDetail}
                numberOfLines={2}
                className="font-Poppins-Regular"
              >
                {formatDate(start_date, true, false, false).date} -{" "}
                {formatDate(end_date, true, false, false).date}
              </Text>
              <Text
                style={styles.ticketDetail}
                numberOfLines={2}
                className="font-Poppins-Regular"
              >
                {formatDate(start_date, true, false, false).time} -{" "}
                {formatDate(end_date, true, false, false).time}
              </Text>
              <Text style={styles.ticketDetail} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.footerTicket}
            onPress={() => {navigateToTicketDetail(registrationId)}}
            className="w-[13%] bg-primary"
          >
            <View style={styles.dashedLineContainer}>
              {Array.from({ length: 25 }).map((_, index) => (
                <View key={index} style={styles.dash} />
              ))}
            </View>
            <Text
              style={styles.footerTicketText}
              className="font-Poppins-SemiBold text-white"
            >
              View Ticket
            </Text>
            <View
              className="absolute top-[48%] -right-3 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-white"
              style={{ borderLeftWidth: 1 }}
            ></View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    padding: 10,
  },
  ticketContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "visible",
    shadowColor: "#000000",
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.17,
    shadowRadius: 5,
    elevation: 7,
  },
  ticketContent: {
    padding: 13,
    paddingTop: 15,
    paddingLeft: 15,
    backgroundColor: "#fff",
  },
  ticketTitle: {
    fontSize: wp("4.5"),
    color: "#000",
  },
  ticketDetail: {
    fontSize: wp("2.8"),
    color: "#000",
    includeFontPadding: false,
    marginBottom: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.17,
    shadowRadius: 5,
    elevation: 7,
  },
  footerTicket: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    includeFontPadding: false,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  footerTicketText: {
    position: "absolute",
    top: "40%",
    width: "190%",
    transform: [{ rotate: "270deg" }],
    color: "#fff",
  },
  dashedLineContainer: {
    position: "absolute",
    left: 0,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  dashedLineContainer2: {
    position: "absolute",
    right: 0,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  dash: {
    width: 1,
    height: 5, // ปรับขนาดจุด
    backgroundColor: "#000",
  },
});
