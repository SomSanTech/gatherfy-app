import { useNavigation } from "expo-router";

const useNavigateToShareProfile = () => {
    const navigation = useNavigation<any>();

    const navigateToShareProfile = () => {
        navigation.navigate("ShareProfile")
    }

    return { navigateToShareProfile }
}
export default useNavigateToShareProfile