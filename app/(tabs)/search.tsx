import {
  ScrollView,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
} from "react-native";
import React, { Fragment } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "@/components/SearchInput";
import EventCard from "@/components/EventCard";
import { AppProvider } from "@/components/AppContext";

const Search = () => {
  return (
    <AppProvider> 
      <Fragment>
        <SafeAreaView
          edges={["top"]}
          className="p-3 pb-0 bg-white shadow"
          style={{ flex: 0 }}
        >
          <SearchInput />
        </SafeAreaView>
        <EventCard />
      </Fragment>
    </AppProvider>
  );
};

export default Search;
