import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { Tabs, Redirect } from "expo-router";
import icons from "../../constants/icons"; // Adjust the path according to your folder structure

import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";


import Home from "./home";
import Liked from "./liked";
import Profile from "./profile";
import Search from "./search";
import Tag from "./tag";
import EventDetail from "../Stack/EventDetail";

// Define prop types
type TabIconProps = {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
};


const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
    </View>
  );
};

// Calculate height based on screen height
const screenHeight = Dimensions.get("window").height;
const tabBarHeight = screenHeight * 0.11; // 10% of screen height

const Tab = createBottomTabNavigator();

function TabNav() {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#D71515",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarStyle: {
          backgroundColor: "rgba(255,255,255,0.8)",
          borderTopWidth: 1,
          borderTopColor: "transparent",
          height: tabBarHeight, // Set to 10% of screen height
        },
      }}
      
    >
      <Tab.Screen
        name="Search"
        component={StackSearch}
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.search}
              color={color}
              name="Search"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tag"
        component={Tag}
        options={{
          title: "Tag",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.tag}
              color={color}
              name="Tag"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={StackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Liked"
        component={Liked}
        options={{
          title: "Liked",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.liked}
              color={color}
              name="Liked"
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.user}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackSearch = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={Search}
        options={{ headerShown: false, }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


export default TabNav;
