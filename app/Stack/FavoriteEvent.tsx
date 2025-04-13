import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import useNavigateToGoBack from "@/composables/navigateToGoBack";


const mockFavoriteEvents = [
  { id: "1", name: "Music Festival 2025" },
  { id: "2", name: "Art & Craft Expo" },
  { id: "3", name: "Startup Pitch Night" },
];

const FavoriteEvent = () => {
  const { navigateToGoBack } = useNavigateToGoBack();

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.eventName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View className="items-center justify-between flex-row">
        <View className="flex-row items-center justify-center mt-1 mb-3">
          <TouchableOpacity onPress={() => navigateToGoBack()} className="">
            <Icon name="chevron-back" size={26} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.header}>Favorite Events</Text>
        </View>
      </View>

      <FlatList
        data={mockFavoriteEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default FavoriteEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventName: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
  },
});
