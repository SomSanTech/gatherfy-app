import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "expo-status-bar";
import SearchInput from "../../components/SearchInput";
import images from "../../constants/icons";

const Home = () => {
  interface Event {
    slug: string;
    name: string;
    date: string;
    location: string; // or adjust this if the field name differs
  }

  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [events, setEvents] = useState<Event[]>([]); // State to hold the fetched events

  useEffect(() => {
    // Simulate data fetching or initialization
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/events");
        const data = await response.json();
        setEvents(data); // Store the fetched events
        setIsLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching events:", error);
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchData(); // Call the fetchData function
    
  }, []);

  return (
    <SafeAreaView className="h-full py-0 px-5 m-0 ">
      <FlatList
        data={events}
        keyExtractor={(item) => item.slug}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.slug}>
            <View className="mb-5 bg-white p-4 rounded-lg w-100">
              <Text className="text-xl font-bold text-primary">
                {item.name}
              </Text>
              <Text>{item.date}</Text>
              <Text>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 pr-4 space-y-6">
            <View className="justify-between items-start flex-row mb-4">
              <View>
                <Text className="text-4xl font-OoohBaby-Regular text-black ">
                  Gatherfy
                </Text>
              </View>

              <View>
                <Image
                  source={images.user}
                  className="w-8 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
      />
      <StatusBar backgroundColor='#fff' style="dark"/>
    </SafeAreaView>
  );
};

export default Home;
