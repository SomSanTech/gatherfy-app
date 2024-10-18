import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

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
        const response = await fetch("http://localhost:8080/api/events");
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
    <SafeAreaView className="h-full py-0 px-5 m-0">
      <ScrollView>
        <View>
          {events.map((event, index) => (
            <TouchableOpacity key={event.slug}>
              <View className="mt-5 bg-white p-4 rounded-lg w-100">
                <Text className="text-xl font-bold text-primary">{event.name}</Text>
                <Text>{event.date}</Text>
                <Text>{event.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
