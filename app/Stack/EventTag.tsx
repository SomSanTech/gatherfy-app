import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvent } from "@/composables/getEvent";
import { RouteProp, useNavigation } from "@react-navigation/native";
import EventCard from "@/components/EventCard";
import Icon from "react-native-vector-icons/Ionicons";

interface EventDetailProps {
  route: any; // Adjust the type as needed
}

const EventTag: React.FC<EventDetailProps> = ({ route }) => {
  const { tag } = route.params;
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchEventData = async () => {
    const data = await getEvent(
      "tag",
      undefined,
      undefined,
      tag,
      undefined,
      undefined
    );
    setEvents(data); // Update events after filtering
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View className=" px-4 py-4 space-y-6" style={styles.headerContainer}>
        <View className="items-center justify-between flex-row">
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text
            className="text-xl font-Poppins-Bold text-center"
            style={styles.headerText}
          >
            {tag}
          </Text>
          <View className="w-6"></View>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View className="m-0 p-0" style={{ flex: 1 }}>
          <EventCard events={events} page="tag" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default EventTag;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    padding: 15,
    position: "relative",
    shadowColor: "#000", // สีของเงา
    shadowOffset: { width: 0, height: 8 }, // เงาเฉพาะด้านล่าง
    shadowOpacity: 0.1, // ความโปร่งแสงของเงา
    shadowRadius: 5, // ความเบลอของเงา
    elevation: 2, // สำหรับ Android
    backgroundColor: "#ffffff", // พื้นหลังของ View
  },
  headerText: {
    fontSize: 21,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#999",
  },
  listContainer: {
    paddingTop: 15,
    paddingBottom: 20,
  },
});
