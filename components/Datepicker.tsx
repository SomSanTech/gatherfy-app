import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Button } from "@rneui/base";

interface DatepickerProps {
  date: string | undefined;

  setDate: Dispatch<SetStateAction<string | undefined>>;
}
const Datepicker: React.FC<DatepickerProps> = ({ date, setDate }) => {
  return (
    <View style={styles.container}>
      <DateTimePicker
        mode="single"
        date={date ? dayjs(date).toDate() : undefined} // ตรวจสอบวันที่ถ้าม
        height={280}
        onChange={(params) => setDate(dayjs(params.date).format("YYYY-MM-DD"))}
        timePickerContainerStyle={{ backgroundColor: "white" }}
        selectedItemColor="#D71515"
        selectedTextStyle={{ fontSize: 18 }}
        headerContainerStyle={{ borderRadius: 20 , paddingHorizontal: 10 , paddingVertical: 5}}
        headerTextStyle={{fontSize: 20 }}
        headerButtonSize={20}
        headerButtonsPosition="around"
        weekDaysTextStyle={{ color: "#D71515" , fontSize: 18 }}
        calendarTextStyle={{ fontSize: 18 }}
      />
      <View className="px-5">
        <Button
          onPress={() => setDate(undefined)}
          buttonStyle={styles.buttonClear}
        >
          Clear Date
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    padding: 15,
    paddingBottom: 20,
    borderRadius: 20,
  },
  buttonClear: {
    backgroundColor: "#D71515",
    color: "white",
    borderRadius: 10,
  },
});

export default Datepicker;
