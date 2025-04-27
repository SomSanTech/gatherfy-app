import { useNavigation } from "@react-navigation/native";

const useNavigateToEventDetail = () => {
  const navigation = useNavigation<any>();

  const navigateToEventDetail = (slug: string) => {
    navigation.navigate("EventDetail", { slug });
  };

  return { navigateToEventDetail };
};

export default useNavigateToEventDetail;
