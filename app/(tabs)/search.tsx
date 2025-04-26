import React, { Fragment, useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
} from "react-native";
import { getEvent } from "@/composables/getEvent";
import { getTag } from "@/composables/getTag";
import SearchInput from "@/components/SearchInput";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import CustomBottomSheet from "@/components/CustomBottomSheet";

const Search = () => {
  const [search, setSearch] = useState<string>(""); // ใช้ useState สำหรับ search
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countResult, setCountResult] = useState<number>(0);

  const [sortBy, setSortBy] = useState<string>("");
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState<{ tag_id: string; tag_title: string }[]>([]);
  const [tag, setTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [date, setDate] = useState<string | undefined>(undefined); // เริ่มต้นเป็น undefined
  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchTagData = async () => {
    const responseTag = await getTag();
    setTags(responseTag);
    setIsLoading(false);
  };

  // ฟังก์ชันจัดการการเลือก tag
  const handleTagPress = (tagTitle: string) => {
    // Update the selected tags based on whether the tag is already selected
    setSelectedTags((prevSelectedTags) => {
      const newSelectedTags = prevSelectedTags.includes(tagTitle)
        ? prevSelectedTags.filter((tag) => tag !== tagTitle)
        : [...prevSelectedTags, tagTitle];

      // After updating selected tags, set the tag string accordingly
      setTag(newSelectedTags.join(","));

      return newSelectedTags; // Return the updated list of selected tags
    });
  };

  const sorting = (type: string) => {
    setSortBy(type); // อัปเดตค่า sort เพียงอย่างเดียว
  };

  const handleSearchSubmit = () => {
    setIsLoading(true); // เริ่มการโหลดข้อมูล
    fetchEventData(); // เรียก fetch ข้อมูลเมื่อกด submit
    bottomSheetRef.current?.close();
  };

  const fetchEventData = async () => {
    const data = await getEvent("search", search, undefined, tag, date, sortBy);

    setEvents(data); // อัปเดต events ที่กรองแล้ว
    setIsSearched(true);
    setIsLoading(false);
    setCountResult(data.length); // อัปเดต count ให้ตรงกับข้อมูลที่กรองแล้ว
  };

  useEffect(() => {
    fetchTagData();
  }, []);

  return (
    <Fragment>
      <SafeAreaView
        edges={["top"]}
        className="flex-1 bg-white"
        style={{
          flex: 0,
        }}
      >
        <SearchInput
          value={search}
          onChangeText={setSearch} // ส่งฟังก์ชัน setSearch ไปยัง SearchInput
          onSearchSubmit={handleSearchSubmit} // ส่งฟังก์ชัน handleSearchSubmit ไปยัง SearchInput
        /> 
        <CustomBottomSheet
          ref={bottomSheetRef}
          title="Add filters"
          events={events}
          setDate={setDate} // ฟังก์ชันสำหรับเปลี่ยนวันที่
          sorting={sorting}
          tags={tags}
          selectedTags={selectedTags}
          handleTagPress={handleTagPress} // ฟังก์ชันสำหรับเลือก tag
          handleSearchSubmit={handleSearchSubmit}
          date={date ?? ""}
          countResult={countResult}
          search={search}
          isSearched={isSearched}
          setIsSearched={setIsSearched}
          isLoading={true}
        />
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({});

export default Search;
