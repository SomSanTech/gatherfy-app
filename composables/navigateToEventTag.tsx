import { useNavigation } from "@react-navigation/native";

const useNavigateToEventTag = (tag:string) => {
  const navigation = useNavigation<any>();

  const navigateToEventTag = (tag: string) => {
    navigation.navigate("EventTag", { tag });
  };

  return { navigateToEventTag };
};

export default useNavigateToEventTag;
