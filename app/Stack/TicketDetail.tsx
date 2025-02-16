import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '@/rootStack/RootStackParamList';


type TicketDetailRouteProp = RouteProp<RootStackParamList, "TicketDetail">;

type TicketDetailProps = {
  route: TicketDetailRouteProp;
};

const TicketDetail : React.FC<TicketDetailProps> = ({ route }) => {
  const { registrationId } = route.params || {}; // ดึงค่า registrationId จาก route.params

  return (
    <SafeAreaView>
      <Text>Ticket Detail</Text>
      {registrationId ? (
        <Text>Registration ID: {registrationId}</Text>
      ) : (
        <Text>No Registration ID provided</Text>
      )}
    </SafeAreaView>
  );
};

export default TicketDetail;

const styles = StyleSheet.create({});
