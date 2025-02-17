import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/rootStack/RootStackParamList";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fetchQuestionReview,
  sendQuestionReview,
} from "@/composables/useFetchQuestionReview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "@/app/context/AuthContext";
import CustomButton from "@/components/CustomButton";
import Icon from "react-native-vector-icons/Ionicons";
import { sub } from "@shopify/react-native-skia";
import { color } from "@rneui/base";
import { Colors } from "@/constants/Colors";
import StarRating from "@/components/StarRating";

type ReviewRouteProp = RouteProp<RootStackParamList, "ReviewScreen">;

type ReviewProps = {
  route: ReviewRouteProp; // Expect the `route` prop
};

type Question = {
  questionId: number;
  questionText: string;
  questionType: string;
  questionTypeName: string;
};

type defaultQuestion = {
  questionText: string;
  questionType: string;
};

const Review: React.FC<ReviewProps> = ({ route }) => {
  const { authState } = useAuth();
  const { eventId } = route.params;
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question[]>([]);

  const navigation = useNavigation();
  const [defaultQuestions, setDefaultQuestions] = useState<defaultQuestion[]>([
    {
      questionText: "How satisfied are you after joining the event ?",
      questionType: "rating",
    },
    {
      questionText: "Comment",
      questionType: "text",
    },
  ]);
  const [answers, setAnswers] = useState<{ [key: number]: string | number }>(
    {}
  );

  const fetchQuestions = async () => {
    if (!authState?.token) {
      setError("You need to log in to view tickets.");
      setRefreshing(false);
      return;
    }

    try {
      const allQuestion = await fetchQuestionReview(eventId, "GET");

      setQuestion([
        ...allQuestion,
        ...defaultQuestions.map((q) => ({ ...q, questionId: 0 })),
      ]);
      setError(null);
    } catch (err) {
      setError("Faild to fetch question.");
    }
    setRefreshing(false);
  };

  const handleAnswerChange = (index: number, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value, // ใช้ index เป็น key
    }));
  };

  const handleSubmit = async () => {
    try {
      const defaultFeedback = {
        eventId: eventId,
        feedbackRating: answers[question.length - 2] || 0,
        feedbackComment: answers[question.length - 1] || "",
      };

      console.log("Sending defaultFeedback:", defaultFeedback);

      const urlDefault = `/api/v2/feedbacks`;
      const defaultResponse = await sendQuestionReview(
        urlDefault,
        "POST",
        defaultFeedback,
        authState?.token
      );

      if (defaultResponse.error) {
        alert(defaultResponse.error); // ✅ แสดงข้อความ error จาก Backend
        return;
      }

      const customQuestions = question
        .filter((q) => q.questionId !== 0)
        .map((q, index) => ({
          questionId: q.questionId,
          answerText: answers[index] || "",
        }))
        .filter((q) => q.answerText !== "");

      if (customQuestions.length > 0) {
        console.log("Sending customQuestions individually:", customQuestions);

        for (const question of customQuestions) {
          console.log(
            "Sending request body:",
            JSON.stringify(customQuestions, null, 2)
          );

          const urlCustom = `/api/v2/answers`;
          const customResponse = await sendQuestionReview(
            urlCustom,
            "POST",
            question, // ส่งคำถามทีละตัว
            authState?.token
          );

          if (customResponse.error) {
            alert(customResponse.error); // ✅ แสดงข้อความ error จาก Backend
            return;
          }
        }
      }

      Alert.alert(
        "Success",
        "Review submitted successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }] // กลับไปหน้าก่อนหน้าหลังจากกด OK
      );
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(`Failed to submit review: ${err.message || err}`);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [authState?.token]);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-6">
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Event Feedback</Text>
        <View className="w-6"></View>
      </View>
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
            <View className="pb-10 px-6">
              {/* <Text style={styles.subHeaderText}>
                  - Please share your feedback regarding the event - 
                </Text> */}
              {question.map((q, index) => (
                <View key={q.questionText} className=" pt-5 mb-2">
                  <Text style={styles.numberQuestion}>
                    Question {index + 1}
                  </Text>
                  <Text style={styles.question}>{q.questionText}</Text>
                  {/* ตรวจสอบประเภทคำถาม */}
                  {q.questionType === "rating" ? (
                    <View className="items-center">
                      <Text style={styles.giveRatingtext}>
                        Give your rating
                      </Text>
                      {/* สามารถแทนที่ View นี้ด้วย Component Rating เช่น Star Rating ได้ */}
                      <StarRating
                        rating={Number(answers[index]) || 0}
                        onChange={(newRating) =>
                          handleAnswerChange(index, newRating)
                        }
                      />
                    </View>
                  ) : q.questionType === "text" ? (
                    <View>
                      <TextInput
                        className="border p-4 mt-3 rounded-lg"
                        style={styles.inputField}
                        onChangeText={(text) => handleAnswerChange(index, text.trim())}
                        value={(answers[index] as string) || ""}
                        multiline={true}
                        placeholder="Write your answer here..."
                      />
                    </View>
                  ) : (
                    <Text>Unknown question type</Text>
                  )}
                </View>
              ))}
              <CustomButton
                title="Submit"
                handlePress={handleSubmit}
                containerStyles={styles.button}
                textStyle={styles.buttonText}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Review;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: wp("5%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    includeFontPadding: false,
  },
  subHeaderText: {
    fontSize: wp("3.2%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-Light",
    textAlign: "center",
    includeFontPadding: false,
    color: Colors.gray,
  },
  numberQuestion: {
    fontSize: wp("3%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-Light",
    marginBottom: 1,
    includeFontPadding: false,
    color: Colors.gray,
  },
  question: {
    fontSize: wp("4.5%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    includeFontPadding: false,
    color: Colors.primary,
  },
  giveRatingtext: {
    fontSize: wp("4%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-Regular",
    marginVertical: 14,
    textAlign: "center",
    includeFontPadding: false,
    color: "#9e9e9e",
  },
  inputField: {
    fontSize: wp("3.5%"), // ขนาด font เป็น 5% ของหน้าจอ
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: wp("4%"),
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
    textAlign: "center",
  },
});
