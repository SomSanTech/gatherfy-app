import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import useNavigateToGoBack from "@/composables/navigateToGoBack";
import { fetchFavortite } from "@/composables/useFetchFavorite";
import * as SecureStore from "expo-secure-store";
import FavoriteCard from "../../components/FavoriteCard"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface FavEvent {
  favoriteId: number,
  eventId: number,
  name: string,
  slug: string,
  image: string,
  createdAt: string
}

const FavoriteEvent = () => {
  const { navigateToGoBack } = useNavigateToGoBack();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.eventName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    try{
      const response = await fetchFavortite(token);
      console.log(response)
      setIsLoading(false);
      setFavorites(response);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
      fetchData()
  }, [] ); // Add eventDetail.eventId to the dependency array

  return (
    <SafeAreaView style={styles.container}>
      <View className="items-center justify-between flex-row py-4">
      <TouchableOpacity onPress={() => navigateToGoBack()} className="">
        <View className="flex-row items-center justify-center">
            <Icon name="chevron-back" size={26} color="#000000" />
          <Text className="text-xl font-Poppins-SemiBold ml-3">Favorite Events</Text>
        </View>
        </TouchableOpacity>
      </View>
      <FavoriteCard events={favorites} page="favorites" />
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
