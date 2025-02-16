import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040" : "http://localhost:4040";

export const fetchQuestionReview = async (eventId: any, method: string) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/questions/event/${eventId}`;

    console.log("question url", url);

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return `Error: ${response.status} - ${response.statusText}`;
    }

    const question = await response.json();

    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    return { error: "Failed to fetch question" };
  }
};

export const sendQuestionReview = async (
  urlToFetch: string,
  method: string,
  body: any,
  token: any
) => {
  try {
    if (!token) {
      console.error("Token is missing. User must be logged in.");
      return { error: "Unauthorized: Missing token" };
    }

    let url = `${API_BASE_URL}${urlToFetch}`;
    console.log("Sending request to:", url);
    console.log("body:", body);
    console.log("token:", token);

    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    console.log("Response status:", response.status);
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      console.error(`Error: ${response.status}`);

      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        return { error: responseData.message || `Error ${response.status}` };
      } else {
        const textData = await response.text(); // ดึงข้อความ error
        return { error: textData || `Error ${response.status}` };
      }
    }

    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      return responseData;
    } else {
      const textData = await response.text();
      return { message: textData };
    }
  } catch (error) {
    console.error("Error sending question review:", error);
    return { error: "Failed to send question review" };
  }
};
