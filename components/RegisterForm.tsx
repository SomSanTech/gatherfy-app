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
  start_date: string;
  end_date: string;
}

const RegisterForm = ({ start_date, end_date }: RegisterFormProps) => {
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
  const [checked, setChecked] = React.useState(false);

  const handleInputChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    // ตรวจสอบความถูกต้องของฟอร์ม
    if (
      !form.date ||
      !form.firstname ||
      !form.lastname ||
      !form.phone ||
      !form.email
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // ส่งข้อมูลฟอร์มหรือดำเนินการอื่น ๆ
    console.log("Form submitted:", form);
    Alert.alert("Success", "You have registered successfully!");
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
      <View>
        <Text style={styles.header}>Register Event</Text>
      </View>
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
      <View style={styles.container}>
        <TextInput
          placeholder="Firstname"
          style={styles.input}
          value={form.firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
          returnKeyType="next"
          onSubmitEditing={() => lastnameRef.current?.focus()} // ย้ายไปที่ Lastname
        />
        <TextInput
          ref={lastnameRef} // Reference สำหรับ Lastname
          placeholder="Lastname"
          style={[styles.input]}
          value={form.lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()} // ย้ายไปที่ Phone
        />
        <TextInput
          ref={phoneRef} // Reference สำหรับ Phone
          placeholder="Phone"
          style={[styles.input, { marginTop: 10 }]}
          value={form.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
          keyboardType="phone-pad"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()} // ย้ายไปที่ Email
        />
        <TextInput
          ref={emailRef} // Reference สำหรับ Email
          placeholder="Email"
          style={[styles.input, { marginTop: 10 }]}
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
          keyboardType="email-address"
          returnKeyType="done"
          onSubmitEditing={handleSubmit} // กด Done แล้วส่งฟอร์ม
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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
    marginTop: 20,
    backgroundColor: "#D71515",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
