import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
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
// ดึงขนาดหน้าจอ
const { width, height } = Dimensions.get("window");

type ShareProfileRouteProp = RouteProp<RootStackParamList, "ShareProfile">;

type ProfileProps = {
  route: ShareProfileRouteProp;
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

const ShareProfile: React.FC<ProfileProps> = ({ route }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(10 * 60);
  const navigation = useNavigation();

  const [eventDetail, setEventDetail] = useState<EventDetail>(
    {} as EventDetail
  );


  const fetchProfile = async () => {
    const firstname = await SecureStore.getItemAsync("firstname");
    const lastname = await SecureStore.getItemAsync("lastname");
    const username = await SecureStore.getItemAsync("username");
    const image = await SecureStore.getItemAsync("image");
    setFirstname(firstname ?? "");
    setLastname(lastname ?? "");
    setUsername(username ?? "");
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
        `api/v1/shareContact`,
        "Post"
      );
      

      console.log("qrResponse" + qrResponse)
      if (!qrResponse) {
        setError("Please try again later");
        return;
      }
      setQrToken(qrResponse);
    } catch (error) {
      setError("Failed to generate QR code");
    } finally {
      setLoading(false);
      console.log(qrToken)
    }
  };
  useEffect(() => {
    genQrToken();
    fetchProfile();
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
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-4 left-4">
          <Icon name="arrow-back" size={26} color="#000000" />
        </TouchableOpacity>
        <View>
          <Text className="text-center text-xl font-semibold">{ username }</Text>
          <View style={styles.qrContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : qrToken ? (
              <QRCode value={qrToken} size={height * 0.3} ecl="L"   />
            ) : (
              <Text style={styles.errorText}>No Data</Text>
            )}
          </View>
          <Text className="mt-5 text-center opacity-60">Show this QR code to friends to let them save you</Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default ShareProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bebebe",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    alignSelf: "center",
    height: height * 0.6,
    width: width * 0.9,
    marginTop: width * 0.1,
    paddingBottom: width * 0.1,
    backgroundColor: "#ffff",
    borderRadius: 20,
    padding: 25,
    justifyContent: "center"
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
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
    fontSize: wp("3.6%"),
  },
  detailText: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    color: "black",
    fontSize: wp("4.8%"),
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
    width: "110%",
    textAlign: "center",
    color: "black",
    fontSize: width * 0.035,
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
    marginTop: hp("1.5%"),
  },

  timerContainer: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  timerText: {
    fontFamily: "Poppins-SemiBold",
    color: "red",
    fontSize: width * 0.04,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  fullname: {
  }
});
