import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView, // เพิ่ม ScrollView
} from "react-native";
import { getTag } from "@/composables/getTag";
import useNavigateToEventTag from "@/composables/navigateToEventTag";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Tag = () => {
  const [tags, setTags] = useState<
    { tag_id: number; tag_title: string; tag_code: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTagData = async () => {
    try {
      const responseTag = await getTag();
      setTags(responseTag);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { navigateToEventTag } = useNavigateToEventTag("defaultTag" , 0);

  useEffect(() => {
    fetchTagData();
  }, []);

  return (
    <Fragment>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Text style={styles.header}>Tags</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false} // ซ่อน scrollbar
          >
            <View style={styles.listContainer}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag.tag_id}
                  style={styles.tagButton}
                  onPress={() => navigateToEventTag(tag.tag_title , tag.tag_id)}
                >
                  <View></View>
                  <Text style={styles.tagText} numberOfLines={1}>{tag.tag_title}</Text>
                  <View
                    style={[styles.tagLine, { backgroundColor: tag.tag_code }]}
                  ></View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 22,
    textAlign: "center",
  },
  scrollView: {
    flex: 1, // ให้ ScrollView ขยายเต็มพื้นที่ที่เหลือ
  },
  scrollContent: {
    flexGrow: 1, // ทำให้เลื่อนเฉพาะเนื้อหาภายใน
    paddingHorizontal: 16,
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  tagButton: {
    backgroundColor: "white",
    width: wp("44%"),
    height: hp("15%"),
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.17,
    shadowRadius: 5,
    elevation: 5,
  },
  tagLine: {
    width: "100%",
    height: 5,
    borderRadius: 9,
  },
  tagText: {
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    lineHeight: 30,
    fontSize: wp("4.5%"),
  },
});

export default Tag;
