import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

export const fetchSubscribed = async (token: any, method: string) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}/api/v1/subscribed`;

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

export const saveSubscribe = async (
  token: any,
  method: string,
  url: string,
  tagId?: number
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let urlToFetch = `${API_BASE_URL}${url}`;

    if (method === "POST") {

      const response = await fetch(urlToFetch, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tagId: tagId }),
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return `Error: ${response.status} - ${response.statusText}`;
      }

      return await response.json();
    } else if (method === "DELETE") {

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

      // 🛠 ตรวจสอบว่า response มีเนื้อหาหรือไม่
      const contentLength = response.headers.get("content-length");
      if (response.status === 204 || !contentLength || Number(contentLength) === 0) {
        return { success: true }; // ไม่มีเนื้อหาให้ parse แต่ถือว่าลบสำเร็จ
      }

      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: "Failed to fetch data" };
  }
};

