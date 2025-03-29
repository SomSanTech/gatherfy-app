import React from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import icons from "../../constants/icons"; // Adjust the path according to your folder structure

import Home from "./home";
import Liked from "./ticket";
import Profile from "./profile";
import Search from "./search";
import Tag from "./tag";
import EventDetail from "../stack/EventDetail";
import EventTag from "../stack/EventTag";
import ScanQR from "../stack/Scanner/ScanQR";
import Review from "../stack/Review";
import Contact from "./contact";
import ShareProfile from "../stack/ShareProfile";
import ScanQrContact from "../stack/Scanner/ScanQrContact";
import EditProfile from "../stack/EditProfile";
import EditSocialMedia from "../stack/EditSocialMedia";
import EmailNotificationSetting from "../stack/EmailNotificationSetting";
import ResetPassword from "../stack/ResetPassword";

import { RootStackParamList } from "@/rootStack/RootStackParamList";
import CustomTabBarButton from "@/components/CustomTabBarButton";
import Ticket from "./ticket";
import TicketDetail from "@/app/stack/TicketDetail";
import { StatusBar } from "expo-status-bar";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Define prop types
type TabIconProps = {
  icon: ImageSourcePropType;
  color: string;
  name: string;
  focused: boolean;
};

// Calculate height based on screen height
const screenHeight = Dimensions.get("window");

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ tintColor: color, width: 24, height: 24 }}
      />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <GestureHandlerRootView>
      <Tab.Navigator
        backBehavior="history"
        initialRouteName="Home"
        screenOptions={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "#D71515",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarStyle:
              routeName === "ScanQR" ||
              routeName == "ScanQrContact" ||
              routeName === "EditProfile" ||
              routeName === "EditSocialMedia"
                ? { display: "none" }
                : {
                    backgroundColor: "white",
                    borderTopWidth: 0.5,
                    borderTopColor: "transparent",
                    paddingHorizontal: 5,
                    elevation: 0, // ลดหรือปิดเงาของ tabBar
                    shadowColor: "transparent", // ไม่มีเงาที่ tabBar
                    flex: 0.07, // ให้ tabBar สูงตามสัดส่วนของจอ
                  },
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          };
        }}
      >
        <Tab.Screen
          name="Home"
          component={StackHomeNavigator}
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
          name="Search"
          component={StackSearchNavigation}
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
        {/* <Tab.Screen
          name="Tag"
          component={StackTagNavigation}
          options={{
            title: "Tag",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.tag}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Ticket"
          component={StackTicketNavigation}
          options={{
            title: "Ticket",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.ticket}
                color={color}
                name="Ticket"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Contact"
          component={StackContactNavigation}
          options={{
            title: "Contact",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.contact}
                color={color}
                name="Ticket"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={StackProfileNavigation}
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
      <StatusBar backgroundColor="transparent" style="dark" />
    </GestureHandlerRootView>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

const StackHomeNavigator = () => {
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
      <Stack.Screen
        name="EventTag"
        component={EventTag}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackSearchNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventTag"
        component={EventTag}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackTagNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TagScreen"
        component={Tag}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventTag"
        component={EventTag}
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

const StackTicketNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TicketScreen"
        component={Ticket}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewScreen"
        component={Review}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventTag"
        component={EventTag}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackContactNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactScreen"
        component={Contact}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQrContact"
        component={ScanQrContact}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShareProfile"
        component={ShareProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditSocialMedia"
        component={EditSocialMedia}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackProfileNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanQR"
        component={ScanQR}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditSocialMedia"
        component={EditSocialMedia}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EmailNotificationSetting"
        component={EmailNotificationSetting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default TabNav;
