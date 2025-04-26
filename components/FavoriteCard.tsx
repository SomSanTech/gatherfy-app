import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import formatDate from "@/utils/formatDate";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "./CustomButton";
import Favorite from "@/assets/icons/favorite-icon.svg";
import FavoriteFill from "@/assets/icons/favorite-fill-icon.svg";
import * as SecureStore from "expo-secure-store";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Event {
  slug: string;
  name: string;
  start_date: string | undefined;
  end_date: string | undefined;
  tags: { tag_id: number; tag_title: string; tag_code: string }[] | undefined;
  image: string;
  location: string | undefined;
}

interface FavEvent {
  favoriteId: number;
  eventId: number;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
}

interface FavoriteCardProps {
  page: string;
  events: Event[];
  search?: string;
  isSearched?: boolean;
  setIsSearched?: (value: boolean) => void;
  isLoading?: boolean;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  page,
  events,
  search,
  isSearched,
  setIsSearched,
  isLoading,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const { navigateToEventDetail } = useNavigateToEventDetail();

  useEffect(() => {
    if (page === "search") {
      if (search && isSearched) {
        setIsSearched && setIsSearched(true);
      } else {
      }
    }
  }, [isLoading]);

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => "_" + item.slug}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      keyboardShouldPersistTaps="handled" // สำคัญ!
      contentContainerStyle={{
        paddingBottom: 20,
        marginTop: 10,
        width: "100%",
        flexWrap: "wrap",
      }}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          key={item.slug}
          onPress={() => navigateToEventDetail(item.slug)}
          className="items-center justify-center"
          style={[
            styles.favCardContainer,
            { height: Platform.OS === "ios" ? wp(50) : wp(50) },
          ]}
        >
          <View style={styles.favoriteContainer}>
            <ImageBackground
              className="w-full h-full object-contain"
              style={styles.imageBackground}
              source={{
                uri: item.image,
              }}
            >
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(255,255,255,0)",
                  "rgba(0,0,0,0.85)",
                ]}
                locations={
                  Platform.OS === "android" ? [0, 0.4, 0.85] : [0.3, 0, 1]
                }
                style={styles.linearBackground}
              >
                <View style={styles.favBox} className="absolute top-3 right-3">
                  <FavoriteFill width={18} height={18} color={"#D71515"} />
                </View>
                <Text
                  numberOfLines={2}
                  className="text-white text-base font-Poppins-SemiBold bottom-5 text-left mx-4"
                  style={styles.favText}
                >
                  {item.name}
                </Text>
              </LinearGradient>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        events ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, color: "gray" }}>
              Can't Find Events You're Looking For
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  favCardContainer: {
    width: "48%",
    margin: "1%",
  },
  favoriteContainer: {
    width: "100%",
    height: "100%",
  },
  imageBackground: {
    overflow: "hidden",
    borderRadius: 10,
  },
  linearBackground: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    borderRadius: 10,
  },
  favBox: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  favText: {
    lineHeight: 24,
  },
});

export default FavoriteCard;
