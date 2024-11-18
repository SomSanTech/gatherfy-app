// import {
//   ScrollView,
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Image,
// } from "react-native";
// import { Fragment, useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import React from "react";
// import { StatusBar } from "expo-status-bar";
// import SearchInput from "../../components/SearchInput";
// import images from "../../constants/icons";
// import EventCard from "../../components/EventCard";
// import { useAppContext } from "@/components/AppContext";

// const Home: React.FC = () => {
//   const [page, setPage] = useState<string>('');
  
//   const updatePage = () => {
//     setPage('home');
//   };

//   useEffect(() => {
//     // Simulate data fetching or initialization
//     const fetchData = async () => {
//       updatePage();
//     };

//     fetchData(); // Call the fetchData function
//   }, []);

//   return (
//     <Fragment>
//       <StatusBar backgroundColor='#800517' style='dark' />
//       <SafeAreaView
//         edges={["top"]}
//         className="p-3 pb-0 bg-white shadow"
//       >
//         <View className="mb-6 px-4 space-y-6 h-9">
//           <View className="item-center justify-center items-start flex-row mb-4">
//             <View className="flex-1"></View>
//             <View>
//               <Text className="text-4xl font-OoohBaby-Regular text-black ">
//                 Gatherfy
//               </Text>
//             </View>

//             <View className="flex-1">
//               <Image
//                 source={images.user}
//                 className="w-8 h-10 ml-auto"
//                 resizeMode="contain"
//               />
//             </View>
//           </View>
//         </View>
//         </SafeAreaView>
//       <View className="m-0 p-0" style={{ flex: 1 }}>
//       <EventCard />
//       </View>
//     </Fragment>
//   );
// };

// export default Home;


import React, { Fragment, useEffect } from "react";
import { View, Text, Image , BackHandler} from "react-native";
import { StatusBar } from "expo-status-bar";
import EventCard from "../../components/EventCard";
import { useAppContext } from "@/components/AppContext";
import images from "../../constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Home: React.FC = () => {
  const { search } = useAppContext();

  useEffect(() => {
    const backAction = () => {
      // Prevent going back to the search page
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  
    return () => backHandler.remove();
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor="#ffffff" style="dark" />
      <SafeAreaView edges={["top"]} className="p-3 pb-0 bg-white shadow">
        <View className="mb-6 px-4 space-y-6 h-9">
          <View className="item-center justify-center items-start flex-row mb-4">
            <View className="flex-1"></View>
            <Text className="text-4xl font-OoohBaby-Regular text-black">Gatherfy</Text>
            <View className="flex-1">
              <Image source={images.user} className="w-8 h-10 ml-auto" resizeMode="contain" />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <View className="m-0 p-0" style={{ flex: 1 }}>
        <EventCard page="home" search={search} />
      </View>
      
    </Fragment>
  );
};

export default Home;
