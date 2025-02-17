import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, router } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import { useAuth } from "@/app/context/AuthContext";
import { backToIndex } from "@/composables/backToIndex";
import { ActivityIndicator } from "react-native-paper";

const SignIn = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const { onLogin } = useAuth();

  const onSignInPress = async () => {
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setIsLoading(false);
      alert("Please fill in all fields.");
      return;
    }

    const result = await onLogin!(username.trim(), password);

    if (result.error) {
      setIsLoading(false);
      alert(result.msg);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-1 bg-gray-100 pt-3">
            <SafeAreaView edges={["top"]} className="flex">
              <View className="flex-row justify-start">
                <TouchableOpacity
                  onPress={backToIndex}
                  className="bg-primary p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
                >
                  <Icon name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-center">
                <Image
                  source={require("@/assets/images/login-image.png")}
                  style={{ width: 240, height: 240 }}
                />
              </View>
            </SafeAreaView>
            <SafeAreaView
              edges={["bottom"]}
              className="flex-1 pb-8 bg-white"
              style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            >
              <Animated.View
                entering={FadeInDown.delay(200).duration(500).springify()}
                className="flex-1  px-8 pt-6"
                style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
              >
                <Text className="text-center py-5 text-3xl font-Poppins-Bold">
                  Log In
                </Text>
                <View className="form space-y-2 gap-4">
                  <View>
                    <Text style={styles.topicField} className="text-sm">
                      Username
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      value={username}
                      onChangeText={setUsername}
                      className="w-100 p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                      placeholder="Enter username"
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      numberOfLines={1}
                    />
                  </View>
                  <View>
                    <Text style={styles.topicField}>Password</Text>
                    <TextInput
                      ref={passwordRef}
                      value={password}
                      onChangeText={setPassword}
                      className="p-4 pr-12 bg-gray-100 text-gray-800 rounded-xl"
                      style={styles.inputField}
                      secureTextEntry={!isPasswordVisible}
                      placeholder="Enter your password"
                      returnKeyType="done"
                      numberOfLines={1}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-5 top-[59%]"
                    >
                      <Icon
                        name={isPasswordVisible ? "eye-off" : "eye"}
                        size={20}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity className="flex items-end mb-5">
                    <Text className="text-gray-600 font-Poppins-Light">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <CustomButton
                      title="Login"
                      handlePress={onSignInPress}
                      containerStyles={{}}
                      textStyle={styles.inputField}
                      classNameContainerStyle="w-full py-3 bg-primary rounded-xl flex-row justify-center items-center"
                      classNameTextStyle="font-Poppins-Bold text-lg text-center text-white"
                      IconComponent={
                        isLoading ? (
                          <ActivityIndicator
                            size="small"
                            color="white"
                            className="mr-5"
                          />
                        ) : null
                      }
                    />
                  </View>
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(400).springify()}
                  >
                    <Text className="text-gray-600 mt-6 text-center font-Poppins-Light">
                      Don't have an account?{" "}
                      <Link href={"/signUp"}>
                        <Text className="font-Poppins-Bold">Sign Up</Text>
                      </Link>
                    </Text>
                  </Animated.View>
                </View>
              </Animated.View>
            </SafeAreaView>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "#ffffff",
  },
  topicField: {
    color: "#000000",
    marginBottom: 12,
    fontFamily: "Poppins-Regular",
  },
  inputField: {
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
});

export default SignIn;
