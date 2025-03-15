import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import Icon from "react-native-vector-icons/Ionicons";

type ContactDetailRouteProp = RouteProp<RootStackParamList, "ContactDetail">;

type ContactDetailProps = {
  route: ContactDetailRouteProp;
};

const ContactDetail: React.FC<ContactDetailProps> = ({ route }) => {
  const { contactId } = route.params || {};
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      {/* ปุ่มย้อนกลับ */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.header}>Contact Detail</Text>
      </View>
      <Text style={styles.contactId}>ID: {contactId}</Text>
    </SafeAreaView>
  );
};

export default ContactDetail;

const styles = StyleSheet.create({
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Poppins-Regular",
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginLeft: 16,
    includeFontPadding: false,
  },
  contactId: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    marginLeft: 16,
  },
});
