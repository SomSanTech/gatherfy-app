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
import images from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvent } from "@/composables/getEvent";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import { ScrollView } from "react-native-gesture-handler";
import ParallaxCarouselCard from "@/components/parallax-carousel/ParallaxCarouselCard";
import Animated, {
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import ParallaxCarouselPagination from "@/components/parallax-carousel/ParallaxCarouselPagination";
import { useNavigation } from "@react-navigation/native";
import groupEventsByDate from "@/utils/groupEventsByDate";
import formatDate from "@/utils/formatDate";
import { Icon } from "react-native-elements";

interface SlideshowData {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const mockupUserName = "MABELZ SUCHADA SONPAN";
const OFFSET = 45; // Define OFFSET with an appropriate value
const Item_width = Dimensions.get("window").width - OFFSET * 2;

const Home: React.FC = () => {
  const [slideshow, setSlideshow] = useState<SlideshowData[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const [activityIndex, setActivityIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAutoPlay, setIsAutoPlay] = useState(true); // Autoplay state
  const [scrolling, setScrolling] = useState(false); // Detect if scrolling manually
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to store the timer

  const fetchData = async () => {
    const data = await getEvent("home");
    setIsLoading(false);
    setEvents(data);
  };

  const fetchSlideshow = async () => {
    const response = await getEvent("homeSlide");

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
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View >
          <View className="px-5 h-24 justify-center" style={styles.header}>
            <View className="items-center justify-between flex-row">
              <View className="flex-row items-center">
                <TouchableOpacity onPress={handleNavigateToProfile}>
                  <Image
                    source={require("@/assets/profile.png")}
                    className="w-12 h-12 mr-4 object-bottom rounded-full"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View className="flex-col">
                  <Text
                    className="text-sm font-Poppins-Light text-black"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Hello
                  </Text>
                  <Text
                    className="text-lg font-Poppins-SemiBold text-black "
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ textTransform: "capitalize" }}
                  >
                    {mockupUserName}
                  </Text>
                </View>
              </View>
              {/* <Text
              className="text-[40px] font-OoohBaby-Regular text-black"
              style={{ lineHeight: 40 }}
            >
              <Text className="text-primary">Ga</Text>therfy
            </Text> */}
              <TouchableOpacity className="w-9">
                <Icon
                  name="ticket-outline"
                  type="ionicon"
                  size={24}
                  color="#000000"
                  onPress={() => navigation.navigate("Ticket")}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-3xl font-Poppins-Regular text-black mx-4 my-5 text-center ">
              Loading events...
            </Text>
          </View>
        ) : Object.entries(groupEventsByDate(events)).length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Image
              source={require("@/assets/noEvent.jpg")}
              className="w-72 h-72 rounded-2xl"
              resizeMode="contain"
            />
            <Text className="text-3xl font-Poppins-SemiBold text-black mx-4 my-10 text-center">
              No Events
            </Text>
          </View>
        ) : (
          <FlatList
            data={[{ type: "slideshow" }, { type: "events" }]}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === "slideshow") {
                return (
                  <View className="mb-3 mt-5">
                    <Text
                      className={`text-center ${
                        Platform.OS === "android"
                          ? "text-[30px] leading-9"
                          : "text-3xl"
                      } font-Poppins-Regular mt-4 mb-3`}
                      style={{ lineHeight: 38 }}
                    >
                      Recommended
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
              } else if (item.type === "events") {
                const groupedEvents = groupEventsByDate(events); // Group events by date
                return (
                  <Fragment key={item.type}>
                    <View className="bg-gray-200 py-5 mx-2 mb-3 rounded-2xl">
                      <Text className="font-Poppins-Regular text-2xl p-4 py-3 pt-0 text-primary">
                        Explore by date
                      </Text>
                      {Object.entries(groupedEvents).map(
                        ([date, eventsOnDate], index) => {
                          const eventsArray = Array.isArray(eventsOnDate)
                            ? eventsOnDate
                            : [];
                          return (
                            <View key={date} className="mb-3">
                              <Text
                                className={`text-lg font-Poppins-Regular text-black mb-3 ${
                                  index === 0 ? "mt-0" : "mt-4"
                                } px-4`}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {formatDate(date, false, false, true).date}
                              </Text>
                              <EventCard
                                key={date}
                                events={eventsArray}
                                page="home"
                              />
                            </View>
                          );
                        }
                      )}
                    </View>
                  </Fragment>
                );
              }
              return null;
            }}
          />
        )}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({

  header: {
    backgroundColor: "#ffffff", // พื้นหลังของ View
    ...Platform.select({
      ios: {
        shadowColor: "#000", // สีของเงา
        shadowOffset: { width: 0, height: 7 }, // เงาเฉพาะด้านล่าง
        shadowOpacity: 0.1, // ความโปร่งแสงของเงา
        shadowRadius: 5, // ความเบลอของเงา
      },
      android: {
        elevation: 5, // เงาสำหรับ Android
        shadowColor: "#000", // สีของเงา (ใช้ elevation บน Android)
      },
    }),
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: Dimensions.get("window").width,
  },
  parallaxCarouselView: {
    paddingBottom: 20,
    paddingTop: 10,
  },
});

export default Home;
