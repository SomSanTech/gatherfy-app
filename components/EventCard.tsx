import React, { Fragment, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useAppContext } from "@/components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface Event {
  slug: string;
  name: string;
  date: string;
  location: string;
}

const EventCard = () => {
  const { search } = useAppContext(); // รับค่า search จาก Context
  const { isLoading, setIsLoading } = useAppContext();
  const [events, setEvents] = useState<Event[]>([]); // State สำหรับเก็บรายการ events

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/events?keyword=${search}`);
      const data = await response.json();
      setEvents(data); // เก็บผลลัพธ์ที่ fetch มาได้ใน state
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false); // เปลี่ยน isLoading เป็น false หลังจาก fetch เสร็จแล้ว
    }
  };

  // เรียกใช้ fetchData เมื่อ enter search หรือเมื่อ isLoading เป็น true
  useEffect(() => {
    if (isLoading) {
      fetchData();
    }
  }, [isLoading]);

  return (
    <Fragment>
      <Text>Current search: {search}</Text>
      <View className="m-0 p-0" style={{ flex: 1 }}>
        <FlatList
          data={events}
          keyExtractor={(item) => item.slug}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity key={item.slug}>
              <View className="mx-4 mt-5 bg-white p-4 rounded-lg w-100 ">
                <Text className="text-xl font-bold text-primary">{item.name}</Text>
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

export default EventCard;
