import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Fragment, useEffect, useState } from "react";
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
    <Fragment>
      <SafeAreaView
        edges={["top"]}
        className="p-3 pb-0 bg-white shadow"
      >
        <View className="mb-6 px-4 space-y-6 h-9">
          <View className="item-center justify-center items-start flex-row mb-4">
            <View className="flex-1"></View>
            <View>
              <Text className="text-4xl font-OoohBaby-Regular text-black ">
                Gatherfy
              </Text>
            </View>

            <View className="flex-1">
              <Image
                source={images.user}
                className="w-8 h-10 ml-auto"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        </SafeAreaView>
      <View className="m-0 p-0" style={{ flex: 1 }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.slug}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 , paddingTop: 10}}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.slug}>
            <View className="mx-4 mt-5 bg-white p-4 rounded-lg w-100 ">
              <Text className="text-xl font-bold text-primary">
                {item.name}
              </Text>
              <Text>{item.date}</Text>
              <Text>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
    </Fragment>
  );
};

export default Home;
