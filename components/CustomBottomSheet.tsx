import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  useBottomSheetTimingConfigs,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Easing } from "react-native-reanimated"; // นำเข้า Easing ที่ถูกต้อง
import Datepicker from "@/components/Datepicker";
import { SortingDropdown } from "@/components/Dropdown";
import EventCard from "./EventCard";
import icons from "@/constants/icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CustomButton from "./CustomButton";

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

type Ref = BottomSheet;

const CustomBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["15%", "50%", "70%", "100%"], []);

  // กำหนด custom timingConfigs
  const timingConfigs = useBottomSheetTimingConfigs({
    duration: 400, // ปรับเวลาของแอนิเมชันเป็น 500ms
    easing: Easing.out(Easing.quad), // ใช้ easing แบบออกช้า
  });

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

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        appearsOnIndex={2}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={styles.bottomModalContainer}>
      <View className="m-0 p-0" style={{ flex: 1 }}>
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
              className="px-4 py-[2px] border rounded-2xl items-center"
            >
              <View className="flex-row items-center">
                <Image
                  source={icons.filter}
                  style={{ width: 18, height: 18 }}
                  className="mr-1 my-auto"
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
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: "white" }}
        handleIndicatorStyle={{ backgroundColor: "#D71515" }}
        animationConfigs={timingConfigs}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={styles.modalContentContainer}
        >
          <View className="pb-5">
            <View className="mb-3 pt-0 rounded-lg">
              <Datepicker date={props.date} setDate={props.setDate} />
            </View>
            <Text className="text-lg text-primary font-Poppins-SemiBold mt-5">
              Sort By
            </Text>
            <View style={styles.sortingWrapper}>
              <SortingDropdown sorting={props.sorting} />
            </View>
            <View className="mb-8 rounded-lg p-0 mt-10">
              <Text className="text-lg text-primary font-Poppins-SemiBold">
                Tags
              </Text>
              <View style={styles.checkboxWrapper}>
                {props.tags.map((tag, index) => (
                  <View key={tag.tag_id} style={styles.checkboxContainer}>
                    <BouncyCheckbox
                      size={25}
                      fillColor="#D71515"
                      unFillColor="#FFFFFF"
                      iconStyle={{ borderColor: "#D71515" }}
                      bounceEffectIn={0.9}
                      bounceEffectOut={1}
                      bounceVelocityIn={0.5}
                      bounceVelocityOut={0.3}
                      bouncinessIn={0.5}
                      bouncinessOut={0.5}
                      text={tag.tag_title} // ใช้ {} แทน ''
                      isChecked={props.selectedTags.includes(tag.tag_title)}
                      onPress={() => props.handleTagPress(tag.tag_title)}
                      textStyle={{
                        fontFamily: "Poppins-Regular",
                        textDecorationLine: "none",
                        padding: 0,
                        color: "#000000",
                        fontSize: wp("3.3%"),
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
            <View className="mb-10">
                <CustomButton
                    title="Search"
                    containerStyles={styles.searchBtn}
                    textStyle={styles.searchBtnText}
                    handlePress={() => { props.handleSearchSubmit()}}
                    disabled={false}
                  />
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
    fontSize: 22,
    fontFamily: "Poppins-Base",
    display: "none"
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
    flexDirection: "row", // เรียงแบบ row
    flexWrap: "wrap", // ให้สามารถขึ้นบรรทัดใหม่ได้
    justifyContent: "space-between", // จัดให้ช่องว่างระหว่าง Checkbox เท่ากัน
    alignItems: "center", // จัดให้อยู่กึ่งกลาง
    // padding: 10,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },

  checkboxContainer: {
    width: "48%", // ทำให้มี 2 อันต่อแถว (แบ่งพื้นที่ 48% ของแต่ละอัน)
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 0,
    marginVertical: 0,
    marginHorizontal: 0,
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
    height: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: "#D71515",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#D71515",
    borderWidth: 1,
  },
  searchBtnText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
});

export default CustomBottomSheet;
