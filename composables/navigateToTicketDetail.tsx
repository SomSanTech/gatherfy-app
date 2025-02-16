import { useNavigation } from "@react-navigation/native";

const useNavigateToTicketDetail = () => {
  const navigation = useNavigation<any>();

  const navigateToTicketDetail = (eventId: number , slug: string) => {
    navigation.navigate("TicketDetail", { eventId , slug });
  };

  return { navigateToTicketDetail };
};

export default useNavigateToTicketDetail;
