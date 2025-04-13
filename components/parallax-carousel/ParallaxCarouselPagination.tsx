import { View, Text, Dimensions, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
  interpolateColor,
} from "react-native-reanimated";
import React from "react";

const OFFSET = 45; // Define OFFSET with an appropriate value
const Item_width = Dimensions.get("window").width - OFFSET * 2;

interface PaginationDotProps {
  index: number;
  scrollX: Animated.SharedValue<number>;
}
const PaginationDot = ({ index, scrollX }: PaginationDotProps) => {
  const inputRange = [
    (index - 1) * Item_width,
    index * Item_width,
    (index + 1) * Item_width,
  ];
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      scrollX.value,
      inputRange,
      [5, 20, 5],
      Extrapolation.CLAMP
    );
    const opacityAnimaton = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      width: widthAnimation,
      opacity: opacityAnimaton,
    };
  });

  const animatedDotColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      [0, Item_width, 2 * Item_width],
      ["#9095A7", "#9095A7", "#9095A7"]
    );
    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.dots, animatedDotStyle, animatedDotColor]} />
  );
};

interface ParallaxCarouselPaginationProps {
  data: any[];
  scrollX: Animated.SharedValue<number>;
}

const ParallaxCarouselPagination = ({
  data,
  scrollX,
}: ParallaxCarouselPaginationProps) => {
  return (
    <View style={styles.paginationConatiner}>
      {data.map((_, index) => {
        return <PaginationDot index={index} scrollX={scrollX} key={index} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationConatiner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    marginTop: 10,
  },
  dots: {
    height: 5,
    marginHorizontal: 8,
    borderRadius: 5,
  },
});

export default ParallaxCarouselPagination;
