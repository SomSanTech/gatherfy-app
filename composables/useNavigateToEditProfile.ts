import { useNavigation } from "expo-router";

const useNavigateToEditProfile = () => {
    const navigation = useNavigation<any>();

    const navigateToEditProfile = () => {
        navigation.navigate("EditProfile")
    }

    return { navigateToEditProfile }
}
export default useNavigateToEditProfile