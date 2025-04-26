import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  StatusBarProps,
} from "react-native";
import EventCard from "../../components/EventCard";
import { useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getEvent } from "@/composables/getEvent";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import { ScrollView } from "react-native-gesture-handler";
import ParallaxCarouselCard from "@/components/parallax-carousel/ParallaxCarouselCard";
import Animated, {
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import * as SecureStore from "expo-secure-store";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ParallaxCarouselPagination from "@/components/parallax-carousel/ParallaxCarouselPagination";
import { useNavigation } from "@react-navigation/native";
import groupEventsByDate from "@/utils/groupEventsByDate";
import formatDate from "@/utils/formatDate";
import { Icon } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUserProfile } from "@/composables/useFetchUserProfile";
import DefaultProfile from "@/assets/images/default-profile.svg";
import { useFocusEffect } from "expo-router";
import { Item_width } from "@/components/parallax-carousel/ParallaxCarouselCard";
import groupEventsByTag from "@/utils/groupEventsByTag";
import useNavigateToEventTag from "@/composables/navigateToEventTag";
import Loader from "@/components/Loader";

interface SlideshowData {
  id: string;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  slug: string;
}

const OFFSET = 45; // Define OFFSET with an appropriate value

const Home: React.FC = () => {
  const [slideshow, setSlideshow] = useState<SlideshowData[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const [activityIndex, setActivityIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { authState } = useAuth();
  const [userInfo, setUserInfo] = useState<any>({});

  const [isAutoPlay, setIsAutoPlay] = useState(true); // Autoplay state
  const [scrolling, setScrolling] = useState(false); // Detect if scrolling manually
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to store the timer
  const { navigateToEventTag } = useNavigateToEventTag();
  const { navigateToEventDetail } = useNavigateToEventDetail();
  const navigation = useNavigation<any>();

  function FocusAwareStatusBar(props: StatusBarProps) {
    const isFocused = useIsFocused();

    return isFocused ? <StatusBar {...props} /> : null;
  }

  const fetchData = async () => {
    const data = await getEvent("home");
    setEvents(data);
    groupEventsByTag(events)
  };

  const fetchSlideshow = async () => {
    const response = await getEvent("homeSlide");

    const slideshowData = response.map((item: any) => ({
      slug: item.slug,
      name: item.name,
      start_date: item.start_date,
      end_date: item.end_date,
      ticket_start_date: item.ticket_start_date,
      ticket_end_date: item.ticket_end_date,
      image: item.image,
    }));
    setSlideshow(slideshowData);
  };


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

  const loadUser = async () => {
    const token = await SecureStore.getItemAsync("my-jwt");
    const user = await fetchUserProfile(token, "/v1/profile", "GET");
    setUserInfo(user);
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      try{
      loadUser();
      fetchData();
      fetchSlideshow();
      } finally {
        // setTimeout(() => {
        setIsLoading(false)
        // }, 500);
      }
    }, [])
  );

  useEffect(() => {}, [authState?.authenticated]);

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
      // setIsAutoPlay(true); // Resume autoplay after scrolling stops
    }, 1000); // Delay for 1 second after the last scroll
  };

  const TABBAR_HEIGHT = 30;

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white relative">
        <FocusAwareStatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <View
          className="items-center justify-between flex-row bg-white rounded-3xl p-4 mx-3"
          style={styles.header}
        >
          <TouchableOpacity onPress={handleNavigateToProfile} className="mr-3">
            {userInfo.users_image ? (
              <Image
                source={{ uri: userInfo.users_image }}
                className="w-12 h-12 object-bottom rounded-full"
                resizeMode="cover"
              />
            ) : (
              <DefaultProfile className="w-12 h-12 object-bottom rounded-full" />
            )}
          </TouchableOpacity>

          <View className="flex-row items-center flex-1">
            <View className="flex-1 pr-4">
              <Text
                className="text-sm font-Poppins-Light text-black"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ includeFontPadding: false }}
              >
                Hello,
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-2xl font-Poppins-SemiBold text-black"
                style={{
                  textTransform: "capitalize",
                  fontSize: Platform.OS === "ios" ? wp("4.4") : wp("4"),
                  includeFontPadding: false,
                }}
              >
                {`${userInfo.users_firstname} ${userInfo.users_lastname}`}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity className="w-12">
              <Icon
                name="heart-outline"
                type="ionicon"
                size={24}
                color="#000000"
                onPress={() => navigation.navigate("FavoriteEvent")}
              />
            </TouchableOpacity>
          </View>
        </View>

        { isLoading ? (
          <Loader />
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
            data={[{ type: "slideshow" }, { type: "events" }, { type: "tags" }]}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === "slideshow") {
                return (
                  <View style={{ marginTop: Platform.OS === "ios" ? 100 : 120 }}>
                    <View className="pt-5 bg-white rounded-b-3xl">
                      <Text
                        className={`text-left pl-7 
                        font-Poppins-SemiBold  mb-2 text-black`}
                        style={{
                          includeFontPadding: false,
                          fontSize: Platform.OS === "ios" ? wp("4.5") : wp("4"),
                        }}
                      >
                        Recommended Events
                      </Text>
                      <View style={styles.parallaxCarouselView}>
                        <Animated.ScrollView
                          ref={scrollViewRef}
                          horizontal={true}
                          decelerationRate={0.6}
                          contentOffset={{ x: 0, y: 0 }}
                          snapToInterval={Item_width} // ✅ ต้องตรงกับขนาดการ์ดจริง
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
                  </View>
                );
              } else if (item.type === "events") {
                const groupedEvents = groupEventsByDate(events); // Group events by date
                return (
                  <Fragment key={item.type}>
                    <View className="py-8 mx-3 rounded-2xl">
                      {Object.entries(groupedEvents).map(
                        ([date, eventsOnDate], index) => {
                          const eventsArray = Array.isArray(eventsOnDate)
                            ? eventsOnDate
                            : [];
                          return (
                            <View key={date} className="mb-3">
                              <Text
                                className={`text-lg font-Poppins-Base text-black ${index === 0 ? "mt-0" : "mt-4"
                                  } px-5`}
                                style={{
                                  fontSize: Platform.OS === "ios" ? wp("4") : wp("3.2"),
                                  textTransform: "capitalize",
                                  includeFontPadding: false,
                                  textAlign: "left",
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {formatDate(date, false, false, true).date}<Text className="font-Poppins-Regular opacity-60"> / {formatDate(date, false, true, false, "daysOfWeek").date}</Text> 
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
                    <View
                      style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        width: "90%",
                        margin: "auto",
                        opacity: 0.3
                      }}
                    />
                  </Fragment>
                );
              } else if (item.type === "tags") {
                const groupedEvents = groupEventsByTag(events);
                console.log("groupedEvents" + groupedEvents)
                return (
                  <Fragment key={item.type}>
                    <View className="mb-4">
                    {Object.entries(groupedEvents).map(
                      ([tag, grouped], index) => {
                        const eventsArray = Array.isArray(grouped)
                          ? grouped.events
                          : [];
                        return (
                          <View className="p-3 mt-4 mx-3">
                            <TouchableOpacity
                              key={tag + events + index}
                              onPress={() => navigateToEventTag(tag, grouped.tag_id)}>
                              <View className="flex-row justify-between my-2 items-center">
                                <View>
                                <Text className="font-Poppins-Regular text-xs">Events for you</Text>
                                <Text className="font-Poppins-Base font-semibold" style={{fontSize: Platform.OS === "ios" ? wp("4") : wp("3.2")}}>{tag}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={26} color="#000000" />
                              </View>
                              <View className="flex-row w-full">
                                {grouped.events.map((item, index) => (
                                  <View
                                    key={tag + index}
                                    style={{ width: index === 0 || index === 3 ? '25%' : '25%', padding: 1}}
                                  >
                                    <Image source={{ uri: item.image }} className={ index === 0 && eventsArray.length === index+ 1 ? "h-36 w-full rounded-lg" : index === 0 ? "h-36 w-full rounded-l-lg" : eventsArray.length === index+ 1 ? "h-36 w-full rounded-r-lg" : "h-36 w-full"}  />
                                  </View>
                                ))}
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      }
                    )}
                    </View>
                  </Fragment>
                )
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
    position: "absolute",
    top: 60,
    zIndex: 2,

    ...Platform.select({
      ios: {
        shadowColor: "#000", // สีของเงา
        shadowOffset: { width: 0, height: 2 }, // เงาเฉพาะด้านล่าง
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
  },
});

export default Home;
