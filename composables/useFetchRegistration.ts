import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040" : "http://localhost:4040";

export const useFetchRegistration = async (body: any , token: any) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/registrations`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 409) {
        alert("Already Registered for the Event");
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        alert("Error during registration. Please try again.");
      }
      return [];
    } else {
      alert("Thank you for registration");
    }

    const data = await response.json(); // Await here to resolve the promise

    return data; // Return the resolved data
  } catch (error) {
    console.error(error);
    return [];
  }
};
