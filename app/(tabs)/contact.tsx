import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { fetchContact } from "@/composables/usefetchContact";
  import * as SecureStore from "expo-secure-store";
  import { useNavigation } from "@react-navigation/native";
  
  const Contact = () => {
    interface Contact {
      contactId: number;
      username: string;
      users_firstname: string;
      users_lastname: string;
      users_image: string;
    }
  
    const [contacts, setContacts] = useState<Contact[]>([]);
    const navigation = useNavigation<any>(); // ดึง navigation มาใช้ใน component
  
    const fetchContacts = async () => {
      const token = await SecureStore.getItemAsync("my-jwt");
      try {
        const response = await fetchContact(token, "api/v1/contacts", "GET");
  
        if (Array.isArray(response)) {
          // แปลงโครงสร้างข้อมูลให้อยู่ในรูปแบบที่เหมาะสม
          const formattedContacts = response.map((contact) => ({
            contactId: contact.contactId,
            username: contact.userProfile.username,
            users_firstname: contact.userProfile.users_firstname,
            users_lastname: contact.userProfile.users_lastname,
            users_image: contact.userProfile.users_image, // เอาไว้แสดงรูปภาพ
          }));
  
          setContacts(formattedContacts);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
  
    useEffect(() => {
      fetchContacts();
    }, []);
  
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <Text style={styles.header}>Contacts</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.contactId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => navigation.navigate("ContactDetail", { contactId: item.contactId })} // ✅ แก้ให้ navigation ใช้ตรงนี้
            >
              <Image
                source={{ uri: item.users_image }}
                style={styles.contactImage}
              />
              <View>
                <Text style={styles.contactName}>{item.username}</Text>
                <Text style={styles.contactFullname}>
                  {item.users_firstname} {item.users_lastname}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No contacts found</Text>
          }
        />
      </SafeAreaView>
    );
  };
  
  export default Contact;
  
  const styles = StyleSheet.create({
    header: {
      fontSize: 24,
      fontFamily: "Poppins-Bold",
      margin: 16,
    },
    contactItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    contactImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16,
    },
    contactName: {
      fontSize: 16,
      fontFamily: "Poppins-Bold",
    },
    contactFullname: {
      fontSize: 14,
      fontFamily: "Poppins-Regular",
    },
    emptyText: {
      margin: 16,
    },
  });
  