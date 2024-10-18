import { View, Text , Image , ImageSourcePropType } from "react-native";
import { Tabs, Redirect } from "expo-router";

import icons from "../../constants/icons"; // Adjust the path according to your folder structure

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
    )
}

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#D71515',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderTopWidth: 1,
                borderTopColor: 'transparent',
                height: 87
               
            }
        }}
      >
         <Tabs.Screen name="liked" options={{ 
            title: "Liked",
            headerShown: false,
            tabBarIcon: ({ color , focused }) => (
              <TabIcon 
                icon={icons.liked}
                color={color}
                name="Liked"
                focused={focused}
              />
            )
        }}/>
         <Tabs.Screen name="search" options={{ 
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ color , focused }) => (
              <TabIcon 
                icon={icons.search}
                color={color}
                name="Search"
                focused={focused}
              />
            )
        }}/>
        <Tabs.Screen name="home" options={{ 
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color , focused }) => (
              <TabIcon 
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
        }}/>
         <Tabs.Screen name="tag" options={{ 
            title: "Tag",
            headerShown: false,
            tabBarIcon: ({ color , focused }) => (
              <TabIcon 
                icon={icons.tag}
                color={color}
                name="tag"
                focused={focused}
              />
            )
        }}/>
         <Tabs.Screen name="profile" options={{ 
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color , focused }) => (
              <TabIcon 
                icon={icons.user}
                color={color}
                name="Profile"
                focused={focused}
              />
            )
        }}/>
      </Tabs>
    </>
  );
};

export default TabsLayout;
