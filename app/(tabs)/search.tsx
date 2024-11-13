// import {
//   ScrollView,
//   View,
//   Platform,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Text,
//   Keyboard,
// } from "react-native";
// import React, { Fragment } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import SearchInput from "@/components/SearchInput";
// import EventCard from "@/components/EventCard";

// const Search = () => {
//   return (
//       <Fragment>
//         <SafeAreaView
//           edges={["top"]}
//           className="p-3 pb-0 bg-white shadow"
//           style={{ flex: 0 }}
//         >
//           <SearchInput />
//         </SafeAreaView>
//         <View className="m-0 p-0" style={{ flex: 1 }}>
//           <EventCard />
//         </View>
//       </Fragment>
//   );
// };

// export default Search;

import React, { Fragment, useState } from "react";
import { View } from "react-native";
import SearchInput from "@/components/SearchInput";
import EventCard from "@/components/EventCard";
import { useAppContext } from "@/components/AppContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { search } = useAppContext();
  const [showEvents, setShowEvents] = useState(false);

  // Triggered when the search button is pressed
  const handleSearch = () => {
    if (search.trim()) {
      setShowEvents(true);
    }else {
      setShowEvents(false);
    }
  };

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} className="p-3 pb-0 bg-white shadow" style={{ flex: 0 }}>
        <SearchInput onSearch={handleSearch} />
      </SafeAreaView>
      <View className="m-0 p-0" style={{ flex: 1 }}>
        {showEvents && <EventCard page="search" search={search} />}
      </View>
    </Fragment>
  );
};

export default Search;

