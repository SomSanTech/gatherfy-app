import { useNavigation } from "expo-router";

const useNavigateToEmailNotificationSetting = () => {
    const navigation = useNavigation<any>();

    const navigateToEmailNotificationSetting = () => {
        navigation.navigate("EmailNotificationSetting")
    }

    return { navigateToEmailNotificationSetting }
}
export default useNavigateToEmailNotificationSetting