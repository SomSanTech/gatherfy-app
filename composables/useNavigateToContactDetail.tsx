import { useNavigation } from "expo-router";

const useNavigateToContactDetail = () => {
    const navigation = useNavigation<any>();

    const navigateToContactDetail = (contactData: any) => {
        navigation.navigate("ContactDetail", {contactData})
        console.log("navigateToContactDetail: " + contactData)
    }

    return { navigateToContactDetail }
}
export default useNavigateToContactDetail