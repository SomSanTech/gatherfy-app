import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040" : "http://localhost:4040";

export const fetchUserProfile = async (
  token: any,
  url: string,
  method: string
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}/api${url}`;

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

export const saveUserProfile = async (
  token: string,
  url: string,
  method: string,
  data: any
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return { error: "API base URL is not set." };
    }

    let urlToFetch = `${API_BASE_URL}/api${url}`;


    const response = await fetch(urlToFetch, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json(); // ✅ อ่าน JSON ก่อนเช็ค response.ok

    if (!response.ok) {
      console.error(
        `Error: ${response.status} - ${response.statusText}`,
        responseData
      );
      return {
        error:
          responseData.error ||
          `Error: ${response.status} - ${response.statusText}`,
        details: responseData.details || {},
      };
    }

    return responseData; // ✅ คืนค่าปกติเมื่อสำเร็จ
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
};

export const resetPassword = async (
  token: string,
  url: string,
  method: string,
  data: any
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return { error: "API base URL is not set." };
    }

    let urlToFetch = `${API_BASE_URL}${url}`;

    const response = await fetch(urlToFetch, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text(); // อ่านข้อมูลเป็นข้อความก่อน
    let responseData;

    try {
      // ลองแปลงข้อความที่ได้รับเป็น JSON ถ้าเป็น JSON
      responseData = JSON.parse(responseText);
    } catch (error) {
      // หากไม่สามารถแปลงเป็น JSON ได้ ให้แสดงข้อความธรรมดา
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error(
        `Error: ${response.status} - ${response.statusText}`,
        responseData
      );
      return {
        error: responseData.message || `Error: ${response.status} - ${response.statusText}`,
        details: responseData.details || {},
      };
    }

    return responseData; // คืนค่าปกติเมื่อสำเร็จ
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
}

