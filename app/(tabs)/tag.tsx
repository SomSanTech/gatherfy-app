import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment } from "react";
import { View, StyleSheet ,Text} from "react-native";
import UnderConstruction from "@/components/UnderConstruction";

const Tag = () => {
  return (
    <Fragment>
      <SafeAreaView className="bg-white" >
      </SafeAreaView>
      <View style={styles.container}>
          <UnderConstruction />
        </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // จัดตำแหน่งแนวตั้ง
    backgroundColor: "#ffffff", // สีพื้นหลัง (ปรับได้ตามต้องการ)
  },
});

export default Tag;
