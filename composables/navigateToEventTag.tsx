import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

const useNavigateToEventTag = () => {
  const navigation = useNavigation<any>();

  const navigateToEventTag = useCallback(
    (tag: string, tagId: number) => {
      navigation.navigate("EventTag", { tag, tagId });
    },
    [navigation]
  );

  return { navigateToEventTag };
};

export default useNavigateToEventTag;
