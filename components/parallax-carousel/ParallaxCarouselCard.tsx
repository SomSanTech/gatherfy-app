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
import React, { useEffect , useState } from "react";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Extrapolation,
} from "react-native-reanimated";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import formatDate from "@/utils/formatDate";
import Icon from "react-native-vector-icons/Ionicons";

// const OFFSET = 45; // Define OFFSET with an appropriate value
// const Item_width = Dimensions.get("window").width - OFFSET * 2;
// const Item_height = 250;

const SCREEN_WIDTH = Dimensions.get("window").width;
export const Item_width = SCREEN_WIDTH * 0.88; // ใช้ 91% ของความกว้างจอ
const Item_height = 255; // ความสูงของ card

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

  const [closeRegister, setCloseRegister] = useState(false);
  const [closeRegisterText, setCloseRegisterText] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const startDate = new Date(item.ticket_start_date);
    const endDate = new Date(item.ticket_end_date);

    if (currentDate < startDate) {
      setCloseRegister(true);
      setCloseRegisterText("SOON");
    } else if (currentDate > endDate) {
      setCloseRegister(true);
      setCloseRegisterText("CLOSED");
    }else{
      setCloseRegister(false);
      setCloseRegisterText("NOW");
    }
  }, [item.start_date, item.end_date]);

  
  const inputRange = [
    (id - 1) * Item_width,
    id * Item_width,
    (id + 1) * Item_width,
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.93, 0.97, 0.93],
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
          marginLeft: id === 0 ? (SCREEN_WIDTH - Item_width) / 2 : undefined,
          marginRight:
            id === total - 1 ? (SCREEN_WIDTH - Item_width) / 2 : undefined,
          overflow: "hidden",
          borderRadius: 25,
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
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          />
          <Animated.View
            style={[styles.imageBackgroundView, translateTextStyle]}
          >
            <View style={styles.inParallaxCardStyles}>
              <View style={styles.titleCardView}>
                <Text
                  style={styles.titleStyle}
                  className="font-Poppins-SemiBold"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name="calendar-outline"
                    size={wp(3)}
                    color="#ffffff"
                    style={{
                      marginRight: 5,
                      elevation: 4,

                      borderRadius: 4, // ถ้าอยากให้เงาดูนุ่มขึ้น
                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                    }}
                  />
                  <Text
                    style={styles.dayStyle}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {formatDate(item.start_date, true, false, true).date} -{" "}
                    {formatDate(item.end_date, true, false, true).date}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonStyle}>
                <Button
                  title={closeRegisterText}
                  titleStyle={{
                    fontSize: wp(2.5),
                    color: "#D71515",
                    fontFamily: "Poppins-SemiBold",
                    textAlign: "center",
                    includeFontPadding: false,
                  }}
                  disabled={closeRegister}
                  buttonStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor: "transparent",
                    padding: 5,
                    borderRadius: 10,
                  }}
                  containerStyle={{
                    width: wp(22),
                  }}
                  onPress={() => navigateToEventDetail(item.slug)}
                />
              </View>
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
  inParallaxCardStyles: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleCardView: {
    width: "70%",
    gap: 2,
    marginBottom: 5,
  },
  titleStyle: {
    fontSize: 24,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 1.5 },
    textShadowRadius: 10,
  },
  dayStyle: {
    fontSize: wp(2.9),
    color: "white",
    fontFamily: "Poppins-SemiBold",
    textAlign: "left",
    includeFontPadding: false,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 1.5 },
    textShadowRadius: 10,
  },
  buttonStyle: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "30%",
  },
});

export default ParallaxCarouselCard;
