// import React, { Fragment, useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { useAppContext } from "@/components/AppContext";
// import { SafeAreaView } from "react-native-safe-area-context";

// interface Event {
//   slug: string;
//   name: string;
//   date: string;
//   tags: string[];
//   location: string;
// }

// const EventCard = () => {
//   const { search } = useAppContext(); // รับค่า search จาก Context
//   const { isLoading, setIsLoading } = useAppContext();
//   const { page, setPage } = useAppContext();
//   const [ events, setEvents ] = useState<Event[]>([]); // State สำหรับเก็บรายการ events

//   const fetchData = async () => {
//     try {
//       if (!search) {
//         setEvents([]); // ถ้าไม่มีค่า search ให้เซ็ต events เป็น array ว่าง
//         return;
//       }
//       if (page == 'home') {
//         const response = await fetch(
//           `http://localhost:8080/api/v1/events`
//         );
//         const data = await response.json();
//         setEvents(data); // เก็บผลลัพธ์ที่ fetch มาได้ใน state
//       }
//       else {
//       const response = await fetch(
//         `http://localhost:8080/api/v1/events?keyword=${search}`
//       );
//       const data = await response.json();
//       setEvents(data); // เก็บผลลัพธ์ที่ fetch มาได้ใน state
//     }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setIsLoading(false); // เปลี่ยน isLoading เป็น false หลังจาก fetch เสร็จแล้ว
//     }
//   };

//   // เรียกใช้ fetchData เมื่อ enter search หรือเมื่อ isLoading เป็น true
//   useEffect(() => {
//     if (isLoading) {
//       fetchData();
//     }
//   }, [page, search, isLoading]);

//   return (
//         <FlatList
//           data={events}
//           keyExtractor={(item) => item.slug}
//           showsHorizontalScrollIndicator={false}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
//           renderItem={({ item }) => (
//             <TouchableOpacity key={item.slug}>
//               <View className="mx-4 mt-5 bg-white p-4 rounded-lg w-100 ">
//                 <Text className="text-xl font-bold text-primary">
//                   {item.name}
//                 </Text>
//                 <Text>{item.tags}</Text>
//                 <Text>{item.location}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//   );
// };

// export default EventCard;

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useAppContext } from "./AppContext";

interface Event {
  slug: string;
  name: string;
  date: string;
  tags: string[];
  location: string;
}

interface EventCardProps {
  page: string;
  search: string;
}

const EventCard: React.FC<EventCardProps> = ({ page, search }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const { isLoading, setIsLoading } = useAppContext();

  const fetchData = async () => {
    try {
      if (page === "home") {
        const response = await fetch("http://localhost:8080/api/v1/events");
        const data = await response.json();
        setEvents(data);
      }
     
      if (page === "search" && search) {
        let url = `http://localhost:8080/api/v1/events?keyword=${search}`;
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
      setIsLoading(false);
      } else if (page === "search" && !search) {
        setEvents([]);
        return;
      }

      
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isLoading]);

  return (
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
            <Text>{item.tags.join(", ")}</Text>
            <Text>{item.location}</Text>
            <Text>{search}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default EventCard;
