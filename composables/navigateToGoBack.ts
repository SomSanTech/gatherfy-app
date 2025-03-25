import { useNavigation } from "expo-router";

const useNavigateToGoBack = () => {
    const navigation = useNavigation<any>();

    const navigateToGoBack = () => {
        navigation.goBack()
    }

    return { navigateToGoBack }
}
export default useNavigateToGoBack