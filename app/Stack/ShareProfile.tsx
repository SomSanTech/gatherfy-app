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

const ShareProfile: React.FC<ProfileProps> = ({ route }) => {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState(10 * 60);
  const navigation = useNavigation();

  const fetchProfile = async () => {
    const username = await SecureStore.getItemAsync("username");
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

      if (!qrResponse) {
        setError("Please try again later");
        return;
      }
      setQrToken(qrResponse);
    } catch (error) {
      setError("Failed to generate QR code");
    } finally {
      setLoading(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-4 left-4"
        >
          <Icon name="chevron-back" size={26} color="#000000" />
        </TouchableOpacity>
        <View>
          <Text
            className="text-center text-xl font-semibold"
            style={styles.username}
          >
            {username}
          </Text>
          <View style={styles.qrContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : qrToken ? (
              <QRCode value={qrToken} size={height * 0.3} ecl="L" />
            ) : (
              <Text style={styles.errorText}>No Data</Text>
            )}
          </View>
          <Text
            className="mt-5 text-center opacity-60"
            style={styles.description}
          >
            Show this QR code to friends to let them save you
          </Text>
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
    justifyContent: "center",
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    includeFontPadding: false,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: hp("1.5%"),
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontFamily: "Poppins-Light",
  },
});
