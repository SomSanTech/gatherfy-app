import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// กำหนดประเภทของ Stack Navigator
type RootStackParamList = {
  ReviewScreen: { eventId: number };
};

const useNavigateToReview = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const navigateToReview = (eventId: number) => {
    navigation.navigate("ReviewScreen", { eventId });
  };

  return { navigateToReview };
};

export default useNavigateToReview;
