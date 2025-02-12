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
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useHandleLogin } from "@/composables/useHandleLogin";
import { useAuth } from "@/app/context/AuthContext";
import BouncyCheckbox from "react-native-bouncy-checkbox";


const SignUp = () => {
  const navigation = useNavigation();
  const firstnameRef = useRef<TextInput>(null);
  const lastnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const handleLogin = useHandleLogin();

  const { onRegister } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View className="flex-1 bg-gray-100 pt-2">
            <SafeAreaView edges={["top"]} className="flex-1">
              <View className="flex-row justify-start">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="bg-primary p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
                >
                  <Icon name="arrow-back" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              {/* <View className="flex-row justify-center">
                <Image
                  source={require("@/assets/images/login-image.png")}
                  style={{ width: 200, height: 200 }}
                />
              </View> */}
            </SafeAreaView>
            <SafeAreaView
              edges={["bottom"]}
              className="flex-1 pb-8 bg-white"
              style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            >
              <Animated.View
                entering={FadeInDown.delay(200).duration(500).springify()}
                className="flex-1 bg-white px-8 pt-5 h-full"
                style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
              >
                <Text className="text-center py-5 text-3xl font-Poppins-Bold">
                  Create Account
                </Text>
                <View className="form space-y-2 gap-4">
                  <View>
                    <Text style={styles.topicField} className="text-sm">
                      Username
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      className="w-100 p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                      placeholder="Enter Your Username"
                      returnKeyType="next"
                      keyboardType="email-address"
                      onSubmitEditing={() => firstnameRef.current?.focus()}
                    />
                  </View>
                  <View className="flex flex-row space-x-2">
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Firstname
                      </Text>
                      <TextInput
                        ref={firstnameRef}
                        style={styles.inputField}
                        className="w-full p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                        placeholder="Firstname"
                        returnKeyType="next"
                        onSubmitEditing={() => lastnameRef.current?.focus()}
                      />
                    </View>
                    <View className="flex-1">
                      <Text style={styles.topicField} className="text-sm">
                        Lastname
                      </Text>
                      <TextInput
                        ref={lastnameRef}
                        style={styles.inputField}
                        className="w-full p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                        placeholder="Lastname"
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={styles.topicField} className="text-sm">
                      Email
                    </Text>
                    <TextInput
                      ref={emailRef}
                      style={styles.inputField}
                      className="w-100 p-4 bg-gray-100 text-gray-800 rounded-xl text-sm"
                      placeholder="eg. gatherfy@example.com"
                      returnKeyType="next"
                      keyboardType="email-address"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </View>
                  <View>
                  <BouncyCheckbox
                      size={25}
                      fillColor="#D71515"
                      unFillColor="#FFFFFF"
                      iconStyle={{ borderColor: "#D71515" }}
                      bounceEffectIn={0.9}
                      bounceEffectOut={1}
                      bounceVelocityIn = {0.5}
                      bounceVelocityOut = {0.3}
                      bouncinessIn = {0.5}
                      bouncinessOut = {0.5}
                   
                      textStyle={{
                        fontFamily: "Poppins-Regular",
                        textDecorationLine: "none",
                        padding: 0,
                        color: "#000000",
                      }}
                    />
                  </View>
                  <View>
                    <Text style={styles.topicField}>Password</Text>
                    <TextInput
                      ref={passwordRef}
                      className="p-4 bg-gray-100 text-gray-800 rounded-xl"
                      style={styles.inputField}
                      secureTextEntry={true}
                      placeholder="Enter Your password"
                      textContentType="newPassword" // บอก iOS ว่าเป็นรหัสผ่านใหม่
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        confirmPasswordRef.current?.focus()
                      }
                    />
                  </View>
                  <View className="mb-3">
                    <Text style={styles.topicField}>Confirm Password</Text>
                    <TextInput
                      ref={confirmPasswordRef}
                      className="p-4 bg-gray-100 text-gray-800 rounded-xl"
                      style={styles.inputField}
                      secureTextEntry={true}
                      placeholder="Confirm your password"
                      returnKeyType="done"
                    />
                  </View>
                  <View>
                    <CustomButton
                      title="Login"
                      handlePress={handleLogin}
                      containerStyles={{}}
                      textStyle={styles.inputField}
                      classNameContainerStyle="w-full py-3 bg-primary rounded-xl"
                      classNameTextStyle="font-Poppins-Bold text-lg text-center text-white"
                    />
                  </View>
                  <Animated.View
                    entering={FadeInDown.delay(800).duration(400).springify()}
                  >
                    <Text className="text-gray-600 mt-1 text-center font-Poppins-Light">
                      Already have an account?{" "}
                      <Link href={"/signIn"}>
                        <Text className="font-Poppins-Bold">Log In</Text>
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

export default SignUp;
