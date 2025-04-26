import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
} from "react-native";
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
  regisDate: string;
}
interface TicketProps {
  item: Ticket;
  reviewed: string[];
}

const TicketCard: React.FC<TicketProps> = ({ item, reviewed }) => {
  const { navigateToReview } = useNavigateToReview();
  const [rotate, setRotate] = useState(false);
  const [closeTicket, setCloseTicket] = useState(false);

  const { navigateToEventDetail } = useNavigateToEventDetail();
  const { navigateToTicketDetail } = useNavigateToTicketDetail();
  const reviewedStrings = reviewed.map((id) => id.toString());

  const { eventId, name, image, slug, start_date, end_date, location, regisDate } = item;

  const validateTicket = () => {
    const currentDate = new Date();
    const formatDateRegis =  formatDate(regisDate, true, false, false).date
    const formatDateCurrent =  formatDate(currentDate.toString(), true, false, false).date
    const formatEndTime =  formatDate(end_date, true, false, false).time
    const formatCurrentTime =  formatDate(currentDate.toString(), true, false, false).time
    if (formatDateCurrent < formatDateRegis) {
      setCloseTicket(true);
    } else if (formatDateCurrent > formatDateRegis) {
      setCloseTicket(true);
    } 
    else if (formatDateCurrent === formatDateRegis && formatCurrentTime > formatEndTime) {
      setCloseTicket(true);
    } 
    else if (formatDateCurrent === formatDateRegis && formatCurrentTime < formatEndTime) {
      setCloseTicket(false);
    } 
  };

  useEffect(() => {
    validateTicket();
    // Force re-render if needed
    const timer = setTimeout(() => {
      setRotate(true);
    }, 0); // Delay to ensure the UI has time to load

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.ticketContainer}
        onPress={() => navigateToEventDetail(slug)}
      >
        <View className="flex-row w-full" style={{ height: Platform.OS === "ios" ? 200 : 230 }}>
          <View
            className="w-[34%] p-3 h-full relative bg-white justify-center"
            style={{ borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
          >
            <View className="w-full h-full justify-between items-center">
              <Image
                source={{ uri: image }}
                className="w-full h-[75%] rounded-md"
                resizeMode="cover"
              />

              <View className="w-full justify-end">
                {/* Check if the ticket has been reviewed */}
                {reviewedStrings.includes(eventId.toString()) ? (
                  <CustomButton
                    title="Reviewed"
                    handlePress={() => {}}
                    containerStyles={{}}
                    textStyle={{
                      includeFontPadding: false,
                      fontSize: wp("3%"),
                    }}
                    classNameContainerStyle="flex-row w-full px-3 py-1 bg-white justify-center items-center border border-[#d8d8d8] rounded-lg"
                    classNameTextStyle="font-Poppins-SemiBold text-regular text-center text-[#d8d8d8] ml-1"
                    IconComponent={
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#d8d8d8"
                      />
                    }
                    isLoading={true} // ปิดการใช้งานปุ่ม
                  />
                ) : (
                  <CustomButton
                    title="Review"
                    handlePress={() => navigateToReview(eventId)}
                    containerStyles={{ }}
                    textStyle={{
                      includeFontPadding: false,
                      fontSize: Platform.OS === 'ios' ? wp("3.5%") : wp("2.8%"),
                    }}
                    classNameContainerStyle="flex-row w-full px-2 py-1 bg-white justify-center items-center border border-black rounded-lg"
                    classNameTextStyle="font-Poppins-Base text-center text-black ml-1"
                    IconComponent={
                      <Ionicons
                        name="star-half-outline"
                        size={20}
                        color="black"
                      />
                    }
                  />
                )}
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
            className="w-[53%] items-start justify-around"
          >
            <Text
              style={styles.ticketTitle}
              numberOfLines={3}
              className="text-xl font-Poppins-SemiBold"
            >
              {name}
            </Text>
            <View className="justify-center items-start">
              <Text
                style={styles.ticketDetail}
                numberOfLines={2}
                className="font-Poppins-Base"
              >
                {formatDate(regisDate, true, false, false).date}
              </Text>
              <Text
                style={styles.ticketDetail}
                numberOfLines={2}
                className="font-Poppins-Base"
              >
                {formatDate(start_date, true, false, false).time} -{" "}
                {formatDate(end_date, true, false, false).time}
              </Text>
              <Text style={styles.ticketDetail} className="font-Poppins-Base" numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.footerTicket}
            onPress={() => {
              navigateToTicketDetail(eventId, slug, formatDate(regisDate, true, false, false).date);
            }}
            disabled={closeTicket}
            className={`w-[13%] ${closeTicket ? 'bg-[#E4E4E4]' : 'bg-primary'}`}
          >
            <View style={styles.dashedLineContainer}>
              {Array.from({ length: 25 }).map((_, index) => (
                <View key={index} style={styles.dash} />
              ))}
            </View>
            <Text
              style={[
                styles.footerTicketText,
                { transform: rotate ? [{ rotate: "270deg" }] : [] },
                closeTicket ? { color: "#9c9c9c" } : { color: "#fff" },
              ]}
              className="font-Poppins-SemiBold text-white"
            >
              {/* {closeTicketText} */}
              View Ticket
            </Text>
          </TouchableOpacity>
          <View
            className="absolute top-[48%] -right-3 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-white"
            style={{ borderLeftWidth: 1 }}
          ></View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TicketCard;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    marginBottom: 20,
    overflow: "visible"
  },
  ticketContainer: {
    position: "relative",
    borderRadius: 10,
    overflow: "visible",
    shadowColor: "#000000",
    // borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.20,
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
    fontSize: Platform.OS === "ios" ? wp("4") : wp("3.2") ,
    color: "#000",
    includeFontPadding: false,
    lineHeight: 22
  },
  ticketDetail: {
    fontSize: Platform.OS === "ios" ? wp("3.1") : wp("2.6"),
    color: "#000",
    includeFontPadding: false,
    marginBottom: 3,
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
    // position: "absolute",
    bottom: Platform.OS === "ios" ? "17%" : "20%", // ย้ายข้อความขึ้นไปตรงกลาง
    // right: "-44%", // ย้ายข้อความไปทางขวากลาง
    width: wp("40%"), // กว้างเท่ากับข้อความ
    transform: [
      { translateX: -wp("15%") }, // เลื่อนข้อความกลับไปครึ่งหนึ่งของความกว้างข้อความ
      { translateY: -hp("2.5%") }, // เลื่อนข้อความกลับไปครึ่งหนึ่งของความสูง
      { rotate: "270deg" }, // หมุนข้อความ
    ],
    fontSize: Platform.OS === "ios" ? wp("3.5") : wp("2.5"),
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
    backgroundColor: "#8888",
  },
});
