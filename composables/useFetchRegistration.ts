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

    let url = `${API_BASE_URL}/api/v2/registrations`;

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
      let errorData;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
          errorMessage = errorData.message || errorMessage; // เอาข้อความจาก backend
        } else {
          errorData = await response.text();
          errorMessage = errorData || errorMessage; // ถ้าเป็น text ก็ใช้แทน
        }
      } catch (err) {
        console.error("Failed to parse error response:", err);
      }
    
      alert(errorMessage);
      console.error(`Error: ${response.status} - ${errorMessage}`);
      return [];
    }
    
    alert("Thank you for registration");
    
    const data = await response.json(); // อ่าน response เมื่อสำเร็จ
    return data;
    
  } catch (error) {
    console.error(error);
    return [];
  }
};
