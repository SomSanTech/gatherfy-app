import Constants from "expo-constants";
import { Platform } from "react-native";

// const API_BASE_URL =
//   Constants.expoConfig?.extra?.apiBaseUrl ||
//   "https://capstone24.sit.kmutt.ac.th";

const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4040" : "http://localhost:4040";

export const useFetchTicketWithAuth = async (
  url: string,
  method: string,
  token: any,
  body?: object
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}/api/${url}`;

    const response = await fetch(urlToFetch, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return `Error: ${response.status} - ${response.statusText}`;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
};
