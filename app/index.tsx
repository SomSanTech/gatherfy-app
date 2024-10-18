import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, Text, View , Image , ActivityIndicator, Button ,StyleSheet} from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constants/images";

export default function App() {


  const [isLoading, setIsLoading] = useState(true); // State for loading
  const router = useRouter(); // Initialize the router
  const goToHome = () => {
    router.push('/home');
  }

  useEffect(() => {
    if (!isLoading) {
      goToHome();
    }
  }, [isLoading, router]);

  if (isLoading) {
    return (
  
      <SafeAreaView className="h-full">
        <ScrollView contentContainerStyle={{height: '100%'}}>
          <View className="w-full justify-center items-center h-full px-4">
   
             <Text className="font-OoohBaby-Regular text-4xl text-black mt-5"><Text className="text-primary">Ga</Text>therfy</Text>
             <Button title="Go to Home" onPress={goToHome} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If isLoading is false, this part won't render because of the redirect

  
}

const styles = StyleSheet.create({

});


