import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

interface UnderConstructionProps {
  page?: string; // ชื่อหน้าที่กำลังกำลังพัฒนา
  message?: string; // ข้อความที่สามารถกำหนดได้
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  page = "",
  message = "This section is under construction.", // ค่าเริ่มต้นของข้อความ
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/underConstruction.jpg")}
        style={{ width: "100%", height: 300 }}
      />
      {page && <Text style={styles.text}>{page}</Text>}

      <Text style={styles.text} className="mb-2">
        {message}
      </Text>
      <Text style={styles.text} className="mb-10">
        404
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // สีพื้นหลัง
    padding: 20,
  },
  text: {
    fontSize: 50,
    color: "#d71515",
    textAlign: "center",
    fontFamily: "Poppins-Bold", // ใช้ font ที่คุณกำหนดไว้ในโปรเจค
  },
});

export default UnderConstruction;
