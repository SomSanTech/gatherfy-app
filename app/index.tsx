import '../gesture/gesture-handler.native'
import "react-native-gesture-handler";
import TabNav from "./(tabs)/_layout";

import { useCallback, useEffect, useState } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';


import {
  ScrollView,
  Text,
  View,
  Image,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";



import { NavigationIndependentTree } from "@react-navigation/native";

export default function App() {
  

  return (
    <NavigationIndependentTree>
      <TabNav />
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({});
