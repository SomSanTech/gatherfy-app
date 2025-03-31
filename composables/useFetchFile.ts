import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th/";

// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040/" : "http://localhost:4040/";

export const useFetchUpload = async (
    url: string,
    file: { uri: string; name?: string; mineType?: string }, // ✅ ใช้ object
    bucket: string,
    token: any
  ) => {
    try {
      if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the app's configuration.");
        return [];
      }
  
      let urlToFetch = `${API_BASE_URL}/api/${url}`;
      console.log("Uploading to:", urlToFetch);
  
      if (!file || !file.uri) {
        console.error("Invalid file input:", file);
        return { error: "Invalid file input" };
      }
  
      const formData = new FormData();
      formData.append("bucket", bucket);
      formData.append("file", {
        uri: file.uri,
        name: file.name || file.uri.split("/").pop(), // ✅ ใช้ชื่อไฟล์จาก uri
        type: file.mineType || "image/jpeg", // ✅ กำหนด MIME type
      } as any);
  
      const response = await fetch(urlToFetch, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,  // ตรวจสอบว่า token ถูกต้องหรือไม่
        },
        body: formData,
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
  

export const useFetchDelete = async (url: string, token: any) => {
    try {
      if (!API_BASE_URL) {
        console.error("API_BASE_URL is not defined in the app's configuration.");
        return [];
      }
  
      let urlToFetch = `${API_BASE_URL}/api/${url}`;
  
      console.log("Token:", token);
      console.log("URL:", urlToFetch);
  
      const response = await fetch(urlToFetch, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return `Error: ${response.status} - ${response.statusText}`;
      }
  
      // ✅ ตรวจสอบว่า response มีเนื้อหาหรือไม่ ก่อนแปลงเป็น JSON
      const contentLength = response.headers.get("content-length");
      if (!contentLength || parseInt(contentLength) === 0) {
        return null; // ไม่มี response body, return เป็น null
      }
  
      return await response.json(); // มีข้อมูล response ค่อย parse JSON
    } catch (error) {
      console.error("Error fetching data:", error);
      return { error: "Failed to fetch data" };
    }
  };
  