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
import NotificationAdd from "@/assets/icons/notification-add.svg";
import * as SecureStore from "expo-secure-store";
import {
  fetchSubscribed,
  saveSubscribe,
} from "@/composables/useFetchSubscribe";

interface EventDetailProps {
  route: any; // Adjust the type as needed
}

const EventTag: React.FC<EventDetailProps> = ({ route }) => {
  const { tag } = route.params;
  const { tagId } = route.params;
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);

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
    // setIsLoading(false);
  };

  const loadSubscribed = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const responseSub = await fetchSubscribed(token, "GET");
    console.log(responseSub); // ตรวจสอบค่าที่ได้

    const subscribedList = responseSub.tagId; // [1, 6]
    console.log(subscribedList);

    if (subscribedList.includes(Number(tagId))) {
      setSubscribed(true);
    }
  };

  const handleChangeSubscribed = () => {
    setSubscribed(!subscribed);
    if (!subscribed) {
      saveSubscription(tagId);
    } else {
      deleteSubscription(tagId);
    }
  };

  const saveSubscription = async (tagId: number) => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const responseSub = await saveSubscribe(token, "POST", `/api/v1/subscribe`, tagId);
    console.log("response sub post"+responseSub);
  };

  const deleteSubscription = async (tagId: number) => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const responseSub = await saveSubscribe(token, "DELETE",`/api/v1/subscribe/${tagId}`);
    console.log("response sub delete"+responseSub);
  };

  useEffect(() => {
    try{
      loadSubscribed();
      fetchEventData();
    }finally{
      setIsLoading(false);
    }
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View className=" px-4 py-4 space-y-3" style={styles.headerContainer}>
        <View className="items-center justify-between flex-row">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
              <Icon name="chevron-back" size={26} color="#000000" />
              <Text
                className="text-xl font-Poppins-SemiBold text-center ml-3"
                style={styles.headerText}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          </View>
          {subscribed ? (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleChangeSubscribed()}
            >
              <Icon
                name="checkmark"
                size={23.2}
                color="#000000"
                style={{ paddingLeft: 2 }}
              />
              <Text style={styles.subscribeButtonText}>Subscribed</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handleChangeSubscribed()}
            >
              <NotificationAdd width={21} height={21} />
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <View className="mx-3 p-0" style={{ flex: 1 }}>
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
    elevation: 2, // สำหรับ Android
    backgroundColor: "#ffffff", // พื้นหลังของ View
  },
  headerText: {
    fontSize: 21,
  },
  subscribeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    // paddingRight: 8,
    backgroundColor: "#f1f1f1",
    borderRadius: 18,
  },
  subscribeButtonText: {
    includeFontPadding: false,
    fontSize: 14.2,
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    marginLeft: 5,
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
