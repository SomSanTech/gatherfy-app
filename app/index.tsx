// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

// import Home  from './(tabs)/home';
// import Liked from './(tabs)/liked';
// import Profile from './(tabs)/profile';
// import Search from './(tabs)/search';
// import Tag from './(tabs)/tag';
// import EventDetail from './Stack/EventDetail';

// import { useEffect, useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import { ScrollView, Text, View , Image , ActivityIndicator, Button ,StyleSheet} from "react-native";
// import { useRouter } from "expo-router"; // Import useRouter
// import { Redirect, router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CustomButton from "../components/CustomButton";
// import images from "../constants/images";

// export default function App() {


//   const [isLoading, setIsLoading] = useState(true); // State for loading
 
//   const goToHome = () => {
//     router.push('/home');
//   }

//   useEffect(() => {
//     if (!isLoading) {
//       goToHome();
//     }
//   }, [isLoading, router]);

//   if (isLoading) {
//     return (
  
//       <SafeAreaView className="h-full">
//         <ScrollView contentContainerStyle={{height: '100%'}}>
//           <View className="w-full justify-center items-center min-h-[85vh] px-4">
   
//              <Text className="font-OoohBaby-Regular text-4xl text-black mt-5"><Text className="text-primary">Ga</Text>therfy</Text>
//              <CustomButton 
//               title="Go to Home"
//               handlePress={goToHome}
//               containerStyles="w-full mt-7"
//               textStyle="text-white"
//               isLoading={!isLoading}
//              />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }
  
// }

// const styles = StyleSheet.create({

// });


import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import TabNav from './(tabs)/_layout';

import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View , Image , ActivityIndicator, Button ,StyleSheet} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import images from "../constants/images";


const Tab = createMaterialBottomTabNavigator();


export default function App() {

  const [isLoading, setIsLoading] = useState(true); // State for loading
 
  const goToHome = () => {
    router.push('/home'); 
  }

  useEffect(() => {
    if (!isLoading) {
      goToHome();
    }
  }, [isLoading, router]);

  if (isLoading) {
    return (
  
      <NavigationContainer independent={true}>
        <TabNav />
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({

});


