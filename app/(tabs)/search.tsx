import React, { Fragment, useState } from "react";
import { View, Platform, Text } from "react-native";
import SearchInput from "@/components/SearchInput";
import EventCard from "@/components/EventCard";
import { useAppContext } from "@/components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { search } = useAppContext();
  const { countResult } = useAppContext();
  return (
    <Fragment>
      <SafeAreaView
        edges={["top"]}
        className="bg-white shadow"
        style={{
          flex: 0,
        }}
      >
        <SearchInput />
      </SafeAreaView>
      <View className="m-0 p-0" style={{ flex: 1 }}>
        <EventCard page="search" search={search} />
      </View>
    </Fragment>
  );
};

export default Search;
