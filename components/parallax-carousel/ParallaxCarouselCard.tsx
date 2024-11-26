import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button } from "@rneui/themed";
import React from "react";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
} from "react-native-reanimated";

const OFFSET = 45; // Define OFFSET with an appropriate value
const Item_width = Dimensions.get("window").width - OFFSET * 2;
const Item_height = 420;

interface ParallaxCarouselCardProps {
  item: any; // Replace 'any' with the appropriate type if known
  id: number;
  scrollX: Animated.SharedValue<number>;
  total: number;
}

const ParallaxCarouselCard: React.FC<ParallaxCarouselCardProps> = ({
  item,
  id,
  scrollX,
  total,
}) => {
  const { navigateToEventDetail } = useNavigateToEventDetail();

  const inputRange = [
    (id - 1) * Item_width,
    id * Item_width,
    (id + 1) * Item_width,
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.97, 0.97, 0.97],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: translate }],
      opacity: opacity,
    };
  });

  const translateImageStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [-Item_width * 0.2, 0, Item_width * 0.4],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateX: translate }],
    };
  });

  const translateTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: Item_width,
          height: Item_height,
          marginLeft: id === 0 ? OFFSET : undefined,
          marginRight: id === total - 1 ? OFFSET : undefined,
          overflow: "hidden",
          borderRadius: 10,
        },
        translateStyle,
      ]}
    >
      <Animated.View style={translateImageStyle}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.ImageBackgroundStyle}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              borderRadius: 10,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
          <Animated.View
            style={[styles.imageBackgroundView, translateTextStyle]}
          >
            <View style={styles.titleCardView}>
              <Text style={styles.titleStyle}>{item.name}</Text>
            </View>
            <View>
              <Button
                title="Register"
                titleStyle={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: "#D71515",
                }}
                buttonStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "transparent",
                  padding: 5,
                  borderRadius: 10,
                }}
                containerStyle={{
                  width: 100,
                }}
                onPress={() => navigateToEventDetail(item.slug)}
              />
            </View>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ImageBackgroundStyle: {
    resizeMode: "cover",
    borderRadius: 14,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
  },
  imageBackgroundView: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex: 1,
    justifyContent: "flex-end",
    gap: 4,
  },
  titleCardView: {
    gap: 2,
    marginBottom: 5,
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default ParallaxCarouselCard;
