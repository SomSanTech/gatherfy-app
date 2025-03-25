import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

export const fetchSocialmedia = async (token: any, method: string) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}/api/v1/socials`;

    const response = await fetch(urlToFetch, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export const saveSocialMediaData = async (
  token: any,
  data: any,
  method: string
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return;
    }

    let urlToFetch = `${API_BASE_URL}/api/v1/socials`;

    console.log("Data to send:", data);
    console.log("Method:", method);
    console.log("URL:", urlToFetch);
    console.log("Token:", token);
    
    const response = await fetch(urlToFetch, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        socialLinks: data,
      }),
    });

    // Check if the response is OK (status code 2xx)
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return `Error: ${response.status} - ${response.statusText}`;
    }

    // Fetch the raw response text (plain text)
    const rawResponse = await response.text();
    console.log("Raw Response:", rawResponse); // Log the raw response

    // Return the raw text as the response
    return { message: rawResponse }; // Return plain text message as response

  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
};


