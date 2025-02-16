import { useNavigation } from "@react-navigation/native";

const useNavigateToTicketDetail = () => {
  const navigation = useNavigation<any>();

  const navigateToTicketDetail = (registrationId: number) => {
    navigation.navigate("TicketDetail", { registrationId });
  };

  return { navigateToTicketDetail };
};

export default useNavigateToTicketDetail;
