import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import {
  useFetchTicketWithAuth,
  fetchReviewedTickets,
} from "@/composables/useFetchTicket";
import { Colors } from "@/constants/Colors";
import TicketCard from "@/components/TicketCard";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "@/components/Loader";
import * as SecureStore from "expo-secure-store";


interface Ticket {
  registrationId: number;
  eventId: number;
  name: string;
  start_date: string;
  end_date: string;
  image: string;
  slug: string;
  location: string;
}

const Ticket = () => {
  const { authState } = useAuth();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reviewedTickets, setReviewedTickets] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!authState?.token) {
      setError("You need to log in to view tickets.");
      setIsLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setIsLoading(true);
      const allTickets = await useFetchTicketWithAuth(
        "v1/tickets",
        "GET",
        authState.token
      );
      const reviewedTicketsData = await fetchReviewedTickets(authState.token);
      setReviewedTickets(reviewedTicketsData.eventId);

      setTickets(allTickets);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tickets.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchTickets();
    }, [authState?.token])
  );

  const onRefresh = useCallback(() => {
    if (isLoading) return; // Prevent refresh if already loading
    setRefreshing(true);
    fetchTickets();
  }, [isLoading]);

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="flex-1 bg-white">
        <View style={styles.container}>
          <Text className="text-xl font-Poppins-SemiBold" style={styles.header}>Tickets</Text>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.eventId.toString()}
              renderItem={({ item }) => (
                <TicketCard item={item} reviewed={reviewedTickets} />
              )}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 5, paddingBottom: 30 }}
              ListEmptyComponent={<Text style={styles.noTickets}>You have not registered for any events.</Text>}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary, "#FF9800"]}
                  tintColor={Colors.primary}
                  progressViewOffset={1}
                />
              }
            />
          )}
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 4,
    textAlign: "center",
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noTickets: {
    marginTop: "50%",
    marginHorizontal: 15,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#888",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Ticket;
