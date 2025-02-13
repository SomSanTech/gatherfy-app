import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useNavigation } from "@react-navigation/native";
import RootStackParamList from "@/rootStack/RootStackParamList";
import { SafeAreaView } from 'react-native-safe-area-context';


type ReviewRouteProp = RouteProp<typeof RootStackParamList, "ReviewScreen">;

type ReviewProps = {
  route: ReviewRouteProp; // Expect the `route` prop
}

const Review: React.FC<ReviewProps> = ({route}) => {
  const { eventId } = route.params;
  return (
    <SafeAreaView>
      <Text>{eventId}</Text>
    </SafeAreaView>
  )
}

export default Review

const styles = StyleSheet.create({})