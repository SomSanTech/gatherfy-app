// Search.tsx
import React, { Fragment, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { getEvent } from "@/composables/getEvent";
import { getTag } from "@/composables/getTag";
import SearchInput from "@/components/SearchInput";
import EventCard from "@/components/EventCard";
import { useAppContext } from "@/components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckBox } from "@rneui/themed";
import Datepicker from "@/components/Datepicker";
import dayjs from "dayjs";

const Search = () => {
  const [search, setSearch] = useState<string>(""); // ใช้ useState สำหรับ search
  const { isLoading, setIsLoading } = useAppContext();
  const [countResult, setCountResult] = useState(Number);
  const [sortBy, setSortBy] = useState<string>("");
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState<{ tag_id: string; tag_title: string }[]>([]);
  const [tag, setTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [date, setDate] = useState<string | undefined>(undefined); // เริ่มต้นเป็น undefined

  const sorting = (type: string) => {
    setSortBy(type); // อัปเดตค่า sort เพียงอย่างเดียว
  };

  const handleTagPress = (tagTitle: string) => {
    // Update the selected tags based on whether the tag is already selected
    setSelectedTags((prevSelectedTags) => {
      const newSelectedTags = prevSelectedTags.includes(tagTitle)
        ? prevSelectedTags.filter((tag) => tag !== tagTitle)
        : [...prevSelectedTags, tagTitle];

      // After updating selected tags, set the tag string accordingly
      setTag(newSelectedTags.join(","));

      console.log(newSelectedTags); // Log the updated selected tags
      return newSelectedTags; // Return the updated list of selected tags
    });
  };

  const fetchEventData = async () => {
    console.log(date);
    
    const data = await getEvent(
      "search",
      search,
      undefined,
      tag,
      date,
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
  };

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
              <View style={styles.checkboxWrapper}>
                {tags.map((tag, index) => (
                  <CheckBox
                    key={tag.tag_id}
                    title={tag.tag_title}
                    checkedColor="#D71515"
                    checked={selectedTags.includes(tag.tag_title)}
                    onPress={() => handleTagPress(tag.tag_title)}
                    containerStyle={[
                      styles.checkboxContainer,
                      selectedTags.includes(tag.tag_title)
                        ? styles.selectedCheckbox
                        : styles.unselectedCheckbox,
                      index >= Math.floor((tags.length - 1) / 2) * 2 &&
                        styles.lastRow,
                    ]}
                    textStyle={[
                      styles.text,
                      selectedTags.includes(tag.tag_title)
                        ? styles.selectedText
                        : styles.unselectedText,
                    ]}
                  />
                ))}
              </View>
            </View>
           <View className="p-5 pt-0 rounded-lg">
              <Datepicker date={date} setDate={setDate} />
            </View>
            <View className="mb-8">
              <TouchableOpacity onPress={() => handleSearchSubmit()}>
                <Text className="text-center mt-5 text-black text-2xl border mx-5 p-4 rounded-lg">Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({}) => (
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

const styles = StyleSheet.create({
  checkboxWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    marginTop: 10,
  },
  checkboxContainer: {
    width: "45%", // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  selectedCheckbox: {
    backgroundColor: "#fff", // สีพื้นหลังเมื่อเลือก
    color: "red", // สีข้อความเมื่อเลือก
  },
  unselectedCheckbox: {
    backgroundColor: "#e0e0e0", // สีพื้นหลังเมื่อไม่เลือก
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#000000", // สีข้อความเมื่อเลือก
  },
  unselectedText: {
    color: "#000000", // สีข้อความเมื่อไม่เลือก
  },
  lastRow: {
    marginBottom: 0, // ไม่มี margin สำหรับแถวสุดท้าย
  },
});

export default Search;
