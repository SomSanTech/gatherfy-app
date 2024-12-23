import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { RadioButton } from "react-native-paper";
import React, { useState, useRef, Fragment } from "react";
import formatDate from "@/utils/formatDate";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFetchRegistration } from "@/composables/useFetchRegistration";

const CustomRadioButton = ({
  label,
  value,
  groupValue,
  onPress,
}: {
  label: string;
  value: number;
  groupValue: number | null;
  onPress: () => void;
}) => {
  return (
    <View style={styles.radioContainer}>
      <TouchableOpacity style={styles.radioWrapper} onPress={onPress}>
        <RadioButton
          value={value.toString()}
          status={groupValue === value ? "checked" : "unchecked"}
          onPress={onPress}
          color="red"
        />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

interface RegisterFormProps {
  eventId: string;
  user: {
    userId: number;
    firstname: string;
    lastname: string;
    username: string;
    gender: string;
    email: string;
    phone: string;
    role: string;
  };
  start_date: string;
  end_date: string;
}

const RegisterForm = ({
  eventId,
  user,
  start_date,
  end_date,
}: RegisterFormProps) => {
  const [form, setForm] = useState({
    date: "",
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
  });

  const lastnameRef = useRef<TextInput>(null); // Reference สำหรับ Lastname
  const phoneRef = useRef<TextInput>(null); // Reference สำหรับ Phone
  const emailRef = useRef<TextInput>(null); // Reference สำหรับ Email

  // const handleInputChange = (name: string, value: string) => {
  //   setForm({ ...form, [name]: value });
  // };
  console.log("User:", user.userId);

  const handleSubmit = async () => {
    // สร้างค่าที่ต้องการในออบเจกต์ชั่วคราว
    const registrationBody = {
      eventId: eventId,
      userId: user.userId,
      status: "Awaiting Check-in",
    };

    // แสดงค่าใน console
    console.log("Registration body:", registrationBody);

    try {
      // เรียกฟังก์ชัน fetch พร้อมส่ง registrationBody
      await useFetchRegistration(registrationBody);
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    }
  };

  // ฟังก์ชันคำนวณจำนวนวันระหว่าง start_date และ end_date
  const betweenDate = (start_date: string, end_date: string) => {
    const start = new Date(start_date);
    const end = new Date(end_date);

    // รีเซ็ตเวลาให้เป็น 00:00:00
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // คำนวณจำนวนวันที่แตกต่าง

    // แสดงวันที่และเวลาในรูปแบบของ Array
    const dateArray = [];
    for (let i = 0; i <= diffDays; i++) {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);
      dateArray.push(newDate);
    }

    return dateArray;
  };

  const checkboxPress = (index: number, date: Date) => {
    setIndex(index);
    setForm({ ...form, date: date.toISOString() });
  };

  const dateArray = betweenDate(start_date, end_date);

  const [selectedIndex, setIndex] = useState<number | null>(null);

  return (
    <Fragment>
      {/* <View className="mb-5" style={styles.checkboxWrapper}>
        {dateArray.map((date, index) => (
          <CustomRadioButton
            key={index}
            label={formatDate(date.toISOString(), true).date}
            value={index}
            groupValue={selectedIndex}
            onPress={() => checkboxPress(index , date)}
          />
        ))}
      </View> */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "48%",
    height: 40,
    borderColor: "gray",
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#D71515",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  checkboxWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  radioContainer: {
    marginVertical: 5,
    width: "50%",
  },
  radioWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default RegisterForm;
