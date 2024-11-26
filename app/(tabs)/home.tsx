import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import EventCard from "../../components/EventCard";
import { useAppContext } from "@/components/AppContext";
import images from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchData } from "@/composables/getEvent";
import useNavigateToEventDetail from "@/composables/navigateToEventDetail";
import { Button } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import ParallaxCarouselCard from "@/components/parallax-carousel/ParallaxCarouselCard";
import Animated, {
  useAnimatedRef,
  useSharedValue,
} from "react-native-reanimated";
import ParallaxCarouselPagination from "@/components/parallax-carousel/ParallaxCarouselPagination";

interface SlideshowData {
  id: string;
  name: string;
  image: string;
  slug: string;
}

const OFFSET = 45; // Define OFFSET with an appropriate value
const Item_width = Dimensions.get("window").width - OFFSET * 2;

const Home: React.FC = () => {
  const { search } = useAppContext();
  const [slideshow, setSlideshow] = useState<SlideshowData[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const [activityIndex, setActivityIndex] = useState(0);

  const [isAutoPlay, setIsAutoPlay] = useState(true); // Autoplay state
  const [scrolling, setScrolling] = useState(false); // Detect if scrolling manually
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use useRef to store the timer


  const flatListRef = useRef<FlatList>(null);
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth); // คำนวณ index แบบปัดค่า
    setActivityIndex(index);
  };

  const fetchSlideshow = async () => {
    const response = await fetchData("home"); // สมมติว่าสไลด์โชว์ข้อมูลอยู่ใน "home"

    const slideshowData = response.map((item: any) => ({
      slug: item.slug,
      name: item.name,
      image: item.image,
    }));
    setSlideshow(slideshowData);
  };
  const renderDotIndicator = () => {
    return slideshow.map((_, index) => {
      const isActive = activityIndex === index; // ตรวจสอบว่า index ปัจจุบันเป็น active หรือไม่

      return (
        <View
          key={index}
          style={{
            backgroundColor: isActive ? "#D71515" : "#B7B7B7", // สีฟ้าเมื่อ active สีแดงเมื่อไม่ active
            height: 8,
            width: 8,
            borderRadius: 5,
            marginHorizontal: 6,
            opacity: isActive ? 1 : 0.5, // ทำให้ dot ที่ไม่ active โปร่งแสงลง
          }}
        ></View>
      );
    });
  };

  const { navigateToEventDetail } = useNavigateToEventDetail();

  const scrollX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoPlay) {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: (activityIndex + 1) % slideshow.length * Item_width,
            animated: true,
          });
          setActivityIndex((prevIndex) => (prevIndex + 1) % slideshow.length);
        }
      }
    }, 4000); // Autoplay every 4 seconds

    return () => clearInterval(interval); // Clear interval on unmount
  }, [activityIndex, slideshow.length, isAutoPlay]); // Depend on autoplay state

  useEffect(() => {
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
      <SafeAreaView edges={["top"]} className="p-3 pb-0 bg-white shadow">
        <View className="mb-6 px-4 space-y-6 h-9">
          <View className="item-center justify-center items-start flex-row mb-4">
            <View className="flex-1"></View>
            <Text className="text-4xl font-OoohBaby-Regular text-black">
              Gatherfy
            </Text>
            <View className="flex-1">
              <Image
                source={images.user}
                className="w-8 h-10 ml-auto"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <FlatList
        data={[{ type: "slideshow" }, { type: "events" }]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (item.type === "slideshow") {
            return (
              <View className="mb-5">
                <View style={styles.parallaxCarouselView}>
                  <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal={true}
                    decelerationRate={0.1}
                    contentOffset={{ x: 0, y: 0 }}
                    snapToInterval={Item_width}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    disableIntervalMomentum
                    scrollEventThrottle={16}
                    onScroll={
                      handleUserScroll
                    }
                  >
                    {slideshow.map((item, index) => (
                      <ParallaxCarouselCard
                        item={item}
                        key={index}
                        id={index}
                        scrollX={scrollX}
                        total={slideshow.length}
                      />
                    ))}
                  </Animated.ScrollView>
                  <ParallaxCarouselPagination
                    data={slideshow}
                    scrollX={scrollX}
                  />
                </View>

                {/* <FlatList
                  data={slideshow}
                  ref={flatListRef}
                  keyExtractor={(slideItem) => slideItem.slug}
                  horizontal={true}
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 20 }}
                  onScroll={handleScroll}
                  renderItem={({ item: slide }) => (
                    <TouchableOpacity
                      style={styles.itemContainer}
                      onPress={() => navigateToEventDetail(slide.slug)}
                    >
                      <View style={{ position: "relative" }}>
                        <Image
                          source={{ uri: slide.image }}
                          style={{
                            width: "100%",
                            height: 200,
                            borderRadius: 10,
                          }}
                          resizeMode="cover"
                        />
                        <View
                          style={{
                            height: "100%",
                            width: "100%",
                            position: "absolute",
                            borderRadius: 10,
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                          }}
                        />
                        <Text
                          style={{
                            position: "absolute",
                            bottom: 55, // ระยะห่างจากด้านล่างของรูป
                            left: 20, // ระยะห่างจากด้านซ้ายของรูป
                            color: "white", // เปลี่ยนสีข้อความให้อ่านง่ายบนพื้นหลังรูป
                            fontSize: 30,
                            fontWeight: "bold",
                            textShadowColor: "rgba(0, 0, 0, 0.75)", // เงาเพื่อให้ข้อความเด่นขึ้น
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 3,
                          }}
                        >
                          {slide.name}
                        </Text>

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
                            position: "absolute",
                            bottom: 18,
                            left: 20,
                          }}
                          onPress={() => navigateToEventDetail(slide.slug)}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                /> */}
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {renderDotIndicator()}
                </View>
              </View>
            );
          } else if (item.type === "events") {
            return (
              <View>
                <Text className="text-center text-[26px] mb-5">
                  Recommended
                </Text>
                <EventCard page="home" search={search} />
              </View>
            );
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
    paddingVertical: 30,
  },
});

export default Home;
