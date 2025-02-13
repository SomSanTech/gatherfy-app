import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-elements";
import Svg, { Path } from "react-native-svg";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import useNavigateToReview  from "@/composables/navigateToReview";

interface Ticket {
  eventId: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  location: string;
}
interface TicketProps {
  item: Ticket;
}

const TicketCard: React.FC<TicketProps> = ({ item }) => {

  const { navigateToReview } = useNavigateToReview();

  const { eventId, name, image, start_date, end_date, location } = item;
  return (
    <View style={styles.container} >
      <TouchableOpacity className="flex-row w-full h-52">
        <View className="w-[40%] h-full" >
          <View className="absolute top-[48%] -left-3 z-50 h-5 w-5 -translate-x-1/2 rounded-full bg-white"></View>
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-lg"
            resizeMode="cover"
          />
        </View>
        <View
          style={styles.ticketContent}
          className="w-3/6 items-start justify-center"
        >
          <Text style={styles.ticketTitle} numberOfLines={3}>
            {name}
          </Text>
          <Text style={styles.ticketDetail} numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View style={styles.footerTicket} className="w-[10%] bg-red-500">
          <View style={styles.dashedLineContainer}>
            {Array.from({ length: 25 }).map((_, index) => (
              <View key={index} style={styles.dash} />
            ))}
          </View>
          <View className="absolute top-[48%] -right-3 h-5 w-5 -translate-x-1/2 rounded-full bg-white"></View>
        </View>
      </TouchableOpacity>
      <View className=" bg-gray-300">
        <View>
          <CustomButton
            title="View Ticket"
            handlePress={() => {}}
            containerStyles={{}}
            textStyle={{}}
            classNameContainerStyle="w-full py-2 bg-primary flex-row justify-center items-center"
            classNameTextStyle="font-Poppins-Bold text-regular text-center text-white"
          />
          <CustomButton
            title="Leave a Review"
            handlePress={() => navigateToReview(eventId)}
            containerStyles={{}}
            textStyle={{}}
            classNameContainerStyle="w-full py-2 bg-white flex-row justify-center items-center border border-black rounded-b-xl "
            classNameTextStyle="font-Poppins-Bold text-regular text-center text-black"
          />
        </View>
      </View>
    </View>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: "relative",
    backgroundColor: "#111",
    borderRadius: 10,
    overflow: "hidden",
  },
  ticketContent: {
    padding: 20,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  ticketDetail: {
    fontSize: 16,
    color: "#bbb",
  },
  footerTicket: {
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dashedLineContainer: {
    position: "absolute",
    left: 0,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  dash: {
    width: 1,
    height: 5, // ปรับขนาดจุด
    backgroundColor: "#fff",
  },
});
