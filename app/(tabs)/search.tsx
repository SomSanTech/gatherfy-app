// Search.tsx
import React, { Fragment, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { getEvent } from "@/composables/getEvent";
import { getTag } from "@/composables/getTag";
import SearchInput from "@/components/SearchInput";
import EventCard from "@/components/EventCard";
import { useAppContext } from "@/components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const [search, setSearch] = useState<string>(""); // ใช้ useState สำหรับ search
  const { isLoading, setIsLoading } = useAppContext();
  const [countResult, setCountResult] = useState(Number);

  const [sortBy, setSortBy] = useState<string>("");
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState<{ tag_id: string ; tag_title: string }[]>([]);
  const [tag, setTag] = useState<string>("");

  const sorting = (type: string) => {
    setSortBy(type); // อัปเดตค่า sort เพียงอย่างเดียว
  };

  const searchByTag = (tag: string) => {
    setSearch(tag);
  }

  const fetchEventData = async () => {
    const data = await getEvent(
      "search",
      search,
      undefined,
      tag,
      undefined,
      sortBy
    );

    setEvents(data); // อัปเดต events ที่กรองแล้ว
    setIsLoading(false);
    setCountResult(data.length); // อัปเดต count ให้ตรงกับข้อมูลที่กรองแล้ว
  };

  const fetchTagData = async () => {
    const responseTag = await getTag();
    setTags(responseTag);
    setIsLoading(false);
    console.log(responseTag);
  }

  // ฟังก์ชันที่เรียกเมื่อผู้ใช้กดปุ่ม submit
  const handleSearchSubmit = () => {
    setIsLoading(true); // เริ่มการโหลดข้อมูล
    fetchEventData(); // เรียก fetch ข้อมูลเมื่อกด submit
  };

  useEffect(() => {
    fetchTagData();
  }, []);
  
  return (
    <Fragment>
      <SafeAreaView
        edges={["top"]}
        className="bg-white shadow"
        style={{
          flex: 0,
        }}
      >
        <SearchInput
          value={search}
          onChangeText={setSearch} // ส่งฟังก์ชัน setSearch ไปยัง SearchInput
          onSearchSubmit={handleSearchSubmit} // ส่งฟังก์ชัน handleSearchSubmit ไปยัง SearchInput
        />
      </SafeAreaView>
      <FlatList
        data={[{ type: "1" }]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {countResult > 0 && (
              <Text className="px-5 pt-4 pb-3 text-sm text-searchText">
                {countResult === 0 ? "" : `${countResult} `}
                {countResult > 1 ? "Results" : "Result"}
              </Text>
            )}
            <View className="mb-8">
              <TouchableOpacity onPress={() => sorting("date_desc")}>
                <Text className="text-center mt-5 text-searchText">Newest</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sorting("date_asc")}>
                <Text className="text-center mt-5 text-searchText">Oldest</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sorting("name_asc")}>
                <Text className="text-center mt-5 text-searchText">A-Z</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sorting("name_desc")}>
                <Text className="text-center mt-5 text-searchText">Z-A</Text>
              </TouchableOpacity>
            </View>
            <View className="mb-8">
              <Text className="text-center mt-5 text-searchText">Tags</Text>
              <View className="flex justify-center">
                {tags.map((tag) => (
                  <TouchableOpacity
                    key={tag.tag_id}
                    onPress={() => setTag(tag.tag_title)}
                  >
                    <Text className="text-center mt-5 text-searchText">
                      {tag.tag_title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View className="mb-8">
              <TouchableOpacity onPress={() => handleSearchSubmit()}>
                <Text className="text-center mt-5 text-searchText">Search</Text>
              </TouchableOpacity>
              </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="m-0 p-0" style={{ flex: 1 }}>
            <EventCard
              page="search"
              search={search}
              events={events}
              isLoading={isLoading}
            />
          </View>
        )}
      />
    </Fragment>
  );
};

export default Search;
