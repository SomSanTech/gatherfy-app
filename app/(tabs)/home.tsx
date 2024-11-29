import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import EventCard from "../../components/EventCard";
import { useAppContext } from "@/components/AppContext";
import images from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvent } from "@/composables/getEvent";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import { Button } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import ParallaxCarouselCard from "@/components/parallax-carousel/ParallaxCarouselCard";
import Animated, {
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import ParallaxCarouselPagination from "@/components/parallax-carousel/ParallaxCarouselPagination";
import { useNavigation } from "@react-navigation/native";


interface SlideshowData {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const OFFSET = 45; // Define OFFSET with an appropriate value
const Item_width = Dimensions.get("window").width - OFFSET * 2;


const Home: React.FC = () => {
  const [slideshow, setSlideshow] = useState<SlideshowData[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const [activityIndex, setActivityIndex] = useState(0);
  const [events, setEvents] = useState([]);

  const [isAutoPlay, setIsAutoPlay] = useState(true); // Autoplay state
  const [scrolling, setScrolling] = useState(false); // Detect if scrolling manually
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to store the timer

  const fetchData = async () => {
    const data = await getEvent("home");
    
    setEvents(data);
  };

  const fetchSlideshow = async () => {
    const response = await getEvent("home");

    const slideshowData = response.map((item: any) => ({
      slug: item.slug,
      name: item.name,
      image: item.image,
    }));
    setSlideshow(slideshowData);
  };

  const { navigateToEventDetail } = useNavigateToEventDetail();

  const navigation = useNavigation<any>();

  const handleNavigateToProfile = () => {
    navigation.navigate("Profile"); // ชื่อหน้าของ Tab Profile ที่ตั้งไว้
  };


  const scrollX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlay) {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: ((activityIndex + 1) % slideshow.length) * Item_width,
            animated: true,
          });
          setActivityIndex((prevIndex) => (prevIndex + 1) % slideshow.length);
        }
      }
    }, 4000); // Autoplay every 4 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [activityIndex, slideshow.length, isAutoPlay]); // Depend on autoplay state

  useEffect(() => {
    fetchData();
    fetchSlideshow();
  }, []);

  // Handle manual scroll detection
  const handleUserScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    setScrolling(true);
    setIsAutoPlay(false); // Pause autoplay on manual scroll
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth); // คำนวณ index แบบปัดค่า
    setActivityIndex(index);

    // Restart autoplay after 1 second of inactivity (scroll stop)
    if (timerRef.current) {
      clearTimeout(timerRef.current); // Clear any existing timeout
    }

    timerRef.current = setTimeout(() => {
      setScrolling(false);
      setIsAutoPlay(true); // Resume autoplay after scrolling stops
    }, 1000); // Delay for 1 second after the last scroll
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#ffffff" style="dark" />
      <SafeAreaView edges={["top"]} className="px-3 mt-4 pb-0 bg-white shadow">
        <View className="mb-5 px-4 space-y-6 h-9">
          <View className="item-center justify-center items-start flex-row mb-4">
            <View className="flex-1"></View>
            <Text className="text-4xl font-OoohBaby-Regular text-black">
              Gatherfy
            </Text>
            <TouchableOpacity onPress={handleNavigateToProfile} className="flex-1">
              <Image
                source={images.user}
                className="w-8 h-10 ml-auto"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <FlatList
        data={[{ type: "slideshow" }, { type: "events" }]}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "slideshow") {
            return (
              <View className="mb-5 mt-7">
                <Text
                  className={`text-center ${
                    Platform.OS === "android"
                      ? "text-[33px] leading-9"
                      : "text-3xl"
                  } font-semibold`}
                >
                  Recommend
                </Text>
                <View style={styles.parallaxCarouselView}>
                  <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal={true}
                    decelerationRate={0.6}
                    contentOffset={{ x: 0, y: 0 }}
                    snapToInterval={Item_width}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    disableIntervalMomentum
                    scrollEventThrottle={16}
                    onScroll={handleUserScroll}
                  >
                    {slideshow.map((item, index) => (
                      <TouchableOpacity
                        key={item.slug}
                        onPress={() => navigateToEventDetail(item.slug)}
                      >
                        <ParallaxCarouselCard
                          item={item}
                          key={index}
                          id={index}
                          scrollX={scrollX}
                          total={slideshow.length}
                        />
                      </TouchableOpacity>
                    ))}
                  </Animated.ScrollView>
                  <ParallaxCarouselPagination
                    data={slideshow}
                    scrollX={scrollX}
                  />
                </View>
              </View>
            );
          } 
          else if (item.type === "events") {
            return <EventCard page="home" events={events} />;
          }
          return null;
        }}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: Dimensions.get("window").width,
  },
  parallaxCarouselView: {
    paddingBottom: 30,
    paddingTop: 20,
  },
});

export default Home;
