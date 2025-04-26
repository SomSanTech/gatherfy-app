import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

export const fetchFavortite = async (token: any) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}/api/v1/favorites`;

    const response = await fetch(urlToFetch, {
      method: "GET",
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

export const addFavortite = async (token: any, body: any) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/favorites`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    
    let errorMessage = "Error during registration. Please try again."; // ข้อความ error เริ่มต้น
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${errorMessage}`);
      return [];
    }
        
    const data = await response.json(); // อ่าน response เมื่อสำเร็จ
    return data;
    
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const removeFavortite = async (token: any, favoriteId: any) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/favorites/${favoriteId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    let errorMessage = "Error during registration. Please try again."; // ข้อความ error เริ่มต้น
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${errorMessage}`);
      return [];
    }
    
    return response;    
  } catch (error) {
    console.error(error);
    return [];
  }
};


