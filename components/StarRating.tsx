import React from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const screenWidth = Dimensions.get("window").width;
  const iconSize = screenWidth * 0.09;

  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={{ fontSize: 24, marginHorizontal: 4 }}>
            {star <= rating ? (
              <Icon name="star" size={iconSize} color="#ffca31" />
            ) : (
              <Icon name="star-outline" size={iconSize} color="#a3a3a3" />
            )}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StarRating;
