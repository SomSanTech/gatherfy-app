import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet, Text } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Button } from "@rneui/base";
import { Dimensions } from "react-native";

interface DatepickerProps {
  date: string | undefined;
  setDate: Dispatch<SetStateAction<string | undefined>>;
  disabledClear?: boolean | true;
}
const Datepicker: React.FC<DatepickerProps> = ({
  date,
  setDate,
  disabledClear = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.customHeader}>- Select Date -</Text>
      <DateTimePicker
        mode="single"
        date={date ? dayjs(date).toDate() : undefined}
        height={Dimensions.get("window").height / 3.1}
        onChange={(params) => setDate(dayjs(params.date).format("YYYY-MM-DD"))}
        timePickerContainerStyle={{ backgroundColor: "white" }}
        selectedItemColor="#D71515"
        selectedTextStyle={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          lineHeight: 24,
        }} // เปลี่ยนฟอนต์ในวันที่เลือก
        headerContainerStyle={{
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
        headerTextStyle={{
          fontSize: 20,
          fontFamily: "Poppins-SemiBold", // ลองใช้ "Arial" หรือ "Roboto" ดูก่อน
          fontWeight: "600",
          textAlign: "center",
        }}
        headerButtonSize={20}
        headerButtonsPosition="around"
        weekDaysTextStyle={{
          color: "#D71515",
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
        }} // เปลี่ยนฟอนต์ในวัน
        calendarTextStyle={{
          fontSize: 18,
          fontFamily: "Poppins-SemiBold",
          lineHeight: 24,
        }} // เปลี่ยนฟอนต์ในตัวเลือกวันที่
      />
      {!disabledClear && (
        <View className="px-5 mt-5">
          <Button
            onPress={() => setDate(undefined)}
            buttonStyle={styles.buttonClear}
            titleStyle={styles.buttonText}
          >
            Clear Date
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingBottom: 20,
    borderRadius: 20,
  },
  buttonClear: {
    backgroundColor: "#D71515",
    color: "white",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontFamily: "Poppins-SemiBold", // เปลี่ยนฟอนต์ที่ต้องการ
    fontSize: 18,
    lineHeight: 24,
    color: "white", // กำหนดสีข้อความหากต้องการ
  },
  customHeader: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold", // ฟอนต์ที่ต้องการ
    marginBottom: 10,
    lineHeight: 30,
    textAlign: "center",
  },
});

export default Datepicker;
