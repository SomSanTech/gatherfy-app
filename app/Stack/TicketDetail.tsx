import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import { fetchQrToken } from "@/composables/useFetchQrToken";
import * as SecureStore from "expo-secure-store";
import QRCode from "react-native-qrcode-svg";
import { getEvent } from "@/composables/getEvent";
import { Colors } from "@/constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import formatDate from "@/utils/formatDate";
// ดึงขนาดหน้าจอ
const { width, height } = Dimensions.get("window");

type TicketDetailRouteProp = RouteProp<RootStackParamList, "TicketDetail">;

type TicketDetailProps = {
  route: TicketDetailRouteProp;
};

interface EventDetail {
  eventId: string;
  slug: string;
  name: string;
  date: string;
  detail: string;
  start_date: string;
  end_date: string;
  tags: string[];
  image: string;
  owner: string;
  location: string;
  map: string;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ route }) => {
  const { eventId } = route.params || {};
  const { slug } = route.params;
  const { regisDate } = route.params;
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(10 * 60);
  const navigation = useNavigation();

  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );

  const fetchEventDetail = async () => {
    setRemainingTime(10 * 60); // ตั้งเวลาหมดอายุ QR Code 10 นาที
    const response = await getEvent("detail", undefined, slug);
    setEventDetail(response);
  };

  const fetchName = async () => {
    const firstname = await SecureStore.getItemAsync("firstname");
    const lastname = await SecureStore.getItemAsync("lastname");
    setFirstname(firstname ?? "");
    setLastname(lastname ?? "");
  };

  const genQrToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await SecureStore.getItemAsync("my-jwt");

      if (!token) {
        setError("Please login ");
        return;
      }

      const qrResponse = await fetchQrToken(
        token,
        `api/v1/check-in/${eventId}`,
        "Post"
      );

      if (!qrResponse?.qrToken) {
        setError("Please try again later");
        return;
      } 
      
      await setQrToken(qrResponse.qrToken);

      
    } catch (error) {
      setError("Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Event ID: ", eventId);
    console.log("Slug: ", slug);

    fetchEventDetail();
    genQrToken();
    fetchName();
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      genQrToken(); // รีเฟรช QR Code เมื่อหมดเวลา
      setRemainingTime(10 * 60); // รีเซ็ตตัวนับถอยหลัง
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // แสดงวันที่หมดอายุของตั๋ว
  const getFormattedDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options); // ใช้ en-GB เพื่อให้เรียง วันที่ เดือน ปี
  };

  const getFormattedTime = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // ใช้ 24 ชั่วโมง (ถ้าอยากได้ AM/PM ให้เปลี่ยนเป็น true)
    };
    return date.toLocaleTimeString("en-GB", options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketBox}>
          <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-7 left-5">
            <Icon name="chevron-back" size={26} color="#000000" />
          </TouchableOpacity>
          <View className="items-center justify-between flex-row mb-4 mx-auto">
            <Text className="text-xl font-Poppins-SemiBold text-center">
             - Ticket -
            </Text>
            <View className="w-6"></View>
          </View>
          <View style={styles.ticketHeader}>
            <View className="items-center mb-4">
              <Text style={styles.headerDetailText}>Event Name</Text>
              <Text style={styles.detailText}>{eventDetail.name}</Text>
            </View>

            <View style={styles.ticketBody}>
              <View>
                <View className="items-center">
                  <Text style={styles.headerDetailText}>Date</Text>
                  <Text style={styles.detailText}>{regisDate}</Text>
                </View>
              </View>
              <View className="items-center">
                <Text style={styles.headerDetailText}>Time</Text>
                <Text style={styles.detailText}>{formatDate(eventDetail.start_date, true, false, false).time}</Text>
              </View>
            </View>

            <View className="items-center justify-center">
              <Text style={styles.headerDetailText}>Location</Text>
              <Text
                style={styles.detailText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {eventDetail.location}
              </Text>
            </View>
          </View>

          <View style={styles.dottedLineContainer}>
            <View style={styles.leftCircle} />
            <Text style={styles.dottedLine}>
              - - - - - - - - - - - - - - - - - - - - - - - - - - 
            </Text>
            <View style={styles.rightCircle} />
          </View>
          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View>
              <View className="items-center mb-6">
                <Text style={styles.headerDetailText}>Name</Text>
                <Text style={styles.detailText}>
                  {firstname} {lastname}
                </Text>
              </View>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : qrToken ? (
              <QRCode value={qrToken} size={height * 0.2} />
            ) : (
              <Text style={styles.errorText}>No Data</Text>
            )}
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Expires in: {formatTime(remainingTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TicketDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bebebe",
    justifyContent: "center",
    alignItems: "center",
  },
  ticketContainer: {
    alignSelf: "center",
    height: Platform.OS === "ios" ? height * 0.8 : height * 0.85 ,
    width: width * 0.9,
    marginTop: width * 0.1,
    paddingBottom: width * 0.1,
  },
  ticketBox: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.04,
    paddingTop: width * 0.08,
    position: "relative",
  },
  ticketHeader: {
    paddingHorizontal: width * 0.05,
  },
  headerDetailText: {
    textAlign: "center",
    color: Colors.primary,
    fontFamily: "Poppins-Base",
    includeFontPadding: false,
    fontSize: Platform.OS === "ios" ? wp("4%") : wp("3.3%"),
  },
  detailText: {
    textAlign: "center",
    fontFamily: "Poppins-Base",
    color: "black",
    fontSize: Platform.OS === "ios" ? wp("4.5%") : wp("3.5%"),
    includeFontPadding: false,
  },
  dottedLineContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: height * 0.02,
    width: "100%",
  },
  leftCircle: {
    height: height * 0.04,
    width: width * 0.08,
    borderRadius: width * 0.1,
    backgroundColor: "#bebebe",
    position: "absolute",
    left: -35,
    top: "58%",
  },
  rightCircle: {
    height: height * 0.04,
    width: width * 0.08,
    borderRadius: width * 0.1,
    backgroundColor: "#bebebe",
    position: "absolute",
    right: -35,
    top: "58%",
  },
  dottedLine: {
    position: "absolute",
    top: "59%",
    width: "100%",
    textAlign: "center",
    color: "#8888",
    fontSize: width * 0.04,
    marginTop: Platform.OS === "ios" ? 4 : 0
  },
  ticketBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },

  qrContainer: {
    alignItems: "center",
    marginTop: hp("3%"),
  },

  timerContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  timerText: {
    fontFamily: "Poppins-Base",
    color: "red",
    fontSize: Platform.OS === "ios" ? 16 : 16,
    includeFontPadding: false,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
});
