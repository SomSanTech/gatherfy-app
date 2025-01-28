import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { forwardRef, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetTimingConfigs,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Button } from "@rneui/themed";
import { CheckBox } from "@rneui/themed";
import { Easing } from "react-native-reanimated"; // นำเข้า Easing ที่ถูกต้อง
import Datepicker from "@/components/Datepicker";
import SortingDropdown from "@/components/Dropdown";
import EventCard from "./EventCard";
import icons from "@/constants/icons";

interface Props {
  title: string;
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  sorting: (type: string) => void;
  tags: { tag_id: string; tag_title: string }[];
  selectedTags: string[];
  handleTagPress: (tagTitle: string) => void;
  handleSearchSubmit: () => void;
  countResult: number;
  search: string;
  isSearched: boolean;
  setIsSearched: (value: boolean) => void;
  events: any;
  isLoading: boolean;
}

const mockupEvent = [
  {
    slug: "event-1",
    name: "Event 1",
    start_date: "2022-01-01",
    end_date: "2022-01-02",
    tags: ["tag1", "tag2"],
    image: "https://via.placeholder.com/150",
    location: "Location 1",
  },
  {
    slug: "event-2",
    name: "Event 2",
    start_date: "2022-01-03",
    end_date: "2022-01-04",
    tags: ["tag2", "tag3"],
    image: "https://via.placeholder.com/150",
    location: "Location 2",
  },
  {
    slug: "event-3",
    name: "Event 3",
    start_date: "2022-01-05",
    end_date: "2022-01-06",
    tags: ["tag1", "tag3"],
    image: "https://via.placeholder.com/150",
    location: "Location 3",
  },
];

type Ref = BottomSheet;

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["15%", "50%", "70%", "100%"], []);

  // กำหนด custom timingConfigs
  const timingConfigs = useBottomSheetTimingConfigs({
    duration: 400, // ปรับเวลาของแอนิเมชันเป็น 500ms
    easing: Easing.out(Easing.quad), // ใช้ easing แบบออกช้า
  });

  const suggestedEvents = mockupEvent;

  const handleClose = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      // ตรวจสอบ ref ก่อนเรียก close()
      ref.current.close();
    }
  };

  const handleOpen = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      // ตรวจสอบ ref ก่อนเรียก open()
      ref.current.snapToIndex(3);
    }
  };

  return (
    <GestureHandlerRootView style={styles.bottomModalContainer}>
      <View className="m-0 p-0" style={{ flex: 1 }}>
        {props.isSearched == false && props.events && (
          <View className="flex-row flex-wrap justify-start items-center mt-1 gap-2 px-5">
            {suggestedEvents.map((event, index) => (
              <TouchableOpacity
                key={index}
                className="text-base text-primary font-Poppins-SemiBold p-3 bg-gray-200 rounded-lg"
              >
                <Text className="text-base text-primary font-Poppins-SemiBold text-center bg-gray-200 rounded-lg">
                  {event.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View className="flex-row justify-between items-center mx-5 mt-1 pb-4">
          {props.countResult > 0 && (
            <Text className="text-sm text-searchText font-Poppins-Regular">
              {props.countResult === 0 ? "" : `${props.countResult} `}
              {props.countResult > 1 ? "Results" : "Result"}
            </Text>
          )}
          <Text> </Text>
          {props.isSearched && (
            <TouchableOpacity
              onPress={handleOpen}
              className="px-4 py-[2px] border rounded-lg items-center"
            >
              <View className="flex-row">
                <Image
                  source={icons.filter}
                  style={{ width: 15, height: 18 }}
                  className="mr-1"
                />
                <Text className="font-Poppins-Regular text-sm"> Filter</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <EventCard
          page="search"
          events={props.events}
          search={props.search}
          isSearched={props.isSearched}
          setIsSearched={props.setIsSearched}
          isLoading={props.isLoading}
        />
      </View>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={BottomSheetBackdrop}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "#D71515" }}
        animationConfigs={timingConfigs}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={styles.modalContentContainer}
        >
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.bottomModalHeadline}>{props.title}</Text>

          <View className="pb-5">
            <View className=" mt-5 mb-3 pt-0 rounded-lg">
              <Datepicker date={props.date} setDate={props.setDate} />
            </View>
            <Text className="text-center text-lg text-primary font-Poppins-SemiBold mt-5">
              Sort By
            </Text>
            <View style={styles.sortingWrapper}>
              <SortingDropdown sorting={props.sorting} />
            </View>
            <View className="mb-5">
              <Text className="text-center text-lg text-primary font-Poppins-SemiBold">
                Tags
              </Text>
              <View style={styles.checkboxWrapper}>
                {props.tags.map((tag, index) => (
                  <CheckBox
                    key={tag.tag_id}
                    title={tag.tag_title}
                    checkedColor="#D71515"
                    value={tag.tag_title}
                    fontFamily="@/assets/fonts/Poppins-Regular.ttf"
                    checked={props.selectedTags.includes(tag.tag_title)}
                    onPress={() => props.handleTagPress(tag.tag_title)}
                    containerStyle={[
                      styles.checkboxContainer,
                      props.selectedTags.includes(tag.tag_title)
                        ? styles.selectedCheckbox
                        : styles.unselectedCheckbox,
                      index >= Math.floor((props.tags.length - 1) / 2) * 2 &&
                        styles.lastRow,
                    ]}
                    textStyle={[
                      styles.text,
                      props.selectedTags.includes(tag.tag_title)
                        ? styles.selectedText
                        : styles.unselectedText,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View className="mb-10">
              <TouchableOpacity onPress={() => props.handleSearchSubmit()}>
                <Text className="text-center mt-5 text-black text-[20px] border  p-3 rounded-lg font-Poppins-SemiBold">
                  Search
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  bottomModalContainer: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  modalContentContainer: {
    flex: 1,
    padding: 36,
    paddingTop: 26,
  },
  bottomModalHeadline: {
    fontSize: 24,
    fontWeight: "600",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  containner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
    width: "44%", // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins-SemiBold",
  },
  selectedText: {
    color: "#000000", // สีข้อความเมื่อเลือก
    textOverflow: "ellipsis",
    fontFamily: "Poppins-SemiBold",
  },
  unselectedText: {
    color: "#000000", // สีข้อความเมื่อไม่เลือก
    textOverflow: "ellipsis",
    fontFamily: "Poppins-SemiBold",
  },
  lastRow: {
    marginBottom: 0, // ไม่มี margin สำหรับแถวสุดท้าย
  },
  sortingWrapper: {
    marginTop: 10,
  },
});

export default CustomBottomSheet;
