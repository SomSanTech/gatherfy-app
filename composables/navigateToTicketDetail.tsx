import { useNavigation } from "@react-navigation/native";

const useNavigateToTicketDetail = () => {
  const navigation = useNavigation<any>();

  const navigateToTicketDetail = (eventId: number , slug: string, regisDate: string) => {
    navigation.navigate("TicketDetail", { eventId , slug, regisDate });
  };

  return { navigateToTicketDetail };
};

export default useNavigateToTicketDetail;
