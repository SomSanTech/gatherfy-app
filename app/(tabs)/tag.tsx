import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getTag } from "@/composables/getTag";
import useNavigateToEventTag from "@/composables/navigateToEventTag";

const Tag = () => {
  const [tags, setTags] = useState<
    { tag_id: string; tag_title: string; tag_code: string }[]
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

  const { navigateToEventTag } = useNavigateToEventTag("defaultTag");
  
  useEffect(() => {
    fetchTagData();
  }, []);

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.header}>Tags</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.listContainer}>
              {tags.map((tag) => (
                <TouchableOpacity
                  key={tag.tag_id}
                  style={styles.tagButton}
                  onPress={() => navigateToEventTag(tag.tag_title)}
                >
                  <View
                    style={[styles.tagLine, { backgroundColor: tag.tag_code }]}
                  ></View>
                  <Text style={styles.tagText}>{tag.tag_title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 22,
    textAlign: "center",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // เพื่อให้แท็กลงแถวใหม่เมื่อพื้นที่ไม่พอ
    justifyContent: "space-between", // จัดระยะห่างระหว่างแท็ก
    paddingHorizontal: 16,
    gap: 10,
  },
  tagButton: {
    backgroundColor: "white",
    width: "47%",
    height: "80%",
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.17,
    shadowRadius: 5,
    elevation: 5,
  },
  tagLine: {
    width: 5,
    height: "100%",
    borderRadius: 9,
    marginRight: 15,
  },
  tagText: {
    fontFamily: "Poppins-SemiBold",
    color: "#000000",
    lineHeight: 30,
    fontSize: 20,
  },
});

export default Tag;
