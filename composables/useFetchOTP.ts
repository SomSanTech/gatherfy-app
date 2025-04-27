import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th/";

// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040/" : "http://localhost:4040/";
// export const useSendOTP = async (url: string, otp: string, email: string) => {
//   const urlToFetch = `${API_BASE_URL}${url}`;
//   try {
//     const response = await fetch(urlToFetch, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, otp }),
//     });

//     const data = await response.json(); // ✅ อ่าน response body

//     if (!response.ok) {
//       console.error(
//         `Error: ${response.status} - ${data.message || response.statusText}`
//       );
//       return {
//         success: false,
//         message:
//           data.message || `Error: ${response.status} - ${response.statusText}`,
//       };
//     }

//     return { success: true, data };
//   } catch (error) {
//     console.error("Error in useSendOTP:", error);
//     return {
//       success: false,
//       message: "Network error. Please try again later.",
//     };
//   }
// };

export const useSendOTP = async (url: string, otp: string, email: string) => {
  const urlToFetch = `${API_BASE_URL}${url}`;
  try {
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    let data;
    
    // ถ้า response เป็น JSON, ใช้ .json() ถ้าเป็น text, ใช้ .text()
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${data || response.statusText}`);
      return {
        success: false,
        message: data || `Error: ${response.status} - ${response.statusText}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in useSendOTP:", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};


export const useResendOTP = async (url: string, email: string) => {
  try {
    const urlToFetch = `${API_BASE_URL}${url}`;
    const response = await fetch(urlToFetch, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // ✅ รองรับ text response
    }

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${data.message || data}`);
      return {
        success: false,
        message: data.message || `Error: ${response.status} - ${data}`,
      };
    }

    return { success: true, message: typeof data === "string" ? data : "OTP sent successfully" };
  } catch (error) {
    console.error("Error in useResendOTP:", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};
