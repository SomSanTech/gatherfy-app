import { useNavigation } from "expo-router";

const useNavigateToResetPassword = () => {
    const navigation = useNavigation<any>();

    const navigateToResetPassword = () => {
        navigation.navigate("ResetPassword")
    }

    return { navigateToResetPassword }
}
export default useNavigateToResetPassword