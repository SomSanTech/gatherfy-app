import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import dayjs from "dayjs";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    role: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: string | undefined,
    gender: string,
    password: string
  ) => Promise<any>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLogout?: () => void;
}

const TOKEN_KEY = "my-jwt";
const API_URL =
  Platform.OS === "ios"
    ? "http://localhost:4040/api/v1"
    : "http://10.0.2.2:4040/api/v1";

export { API_URL };

// export const API_URL = "https://api.developbetterapps.com";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("store-token: ", token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const register = async (
    role: string,
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: string | undefined,
    gender: string,
    password: string
  ) => {
    
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        role,
        username,
        firstname,
        lastname,
        email,
        phone,
        birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss") , 
        gender,
        password,
      });
      return response; // ถ้าสำเร็จให้ส่ง response กลับ
    } catch (err: any) {
      // ตรวจสอบ error เพื่อแสดงข้อความที่เข้าใจได้ง่าย
      const errorMsg = err?.response?.data?.message || "An unexpected error occurred. Please try again later.";
      console.error("Registration Error:", errorMsg);
      return { error: true, msg: errorMsg };
    }
  };



// const register = async (
//   role: string,
//   username: string,
//   firstname: string,
//   lastname: string,
//   email: string,
//   phone: string,
//   birthday: string | undefined,
//   gender: string,
//   password: string
// ) => {
//   const [isLoading, setIsLoading] = useState(false);  // ใช้สถานะเพื่อติดตามการโหลด

//   try {
//     setIsLoading(true);  // ตั้งค่าเป็นกำลังโหลด

//     const response = await axios.post(`${API_URL}/signup`, {
//       role,
//       username,
//       firstname,
//       lastname,
//       email,
//       phone,
//       birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss"), 
//       gender,
//       password,
//     });

//     console.log(response.data.birthday);
    
//     setIsLoading(false);  // หยุดสถานะการโหลดเมื่อเสร็จ

//     return response;  // ถ้าสำเร็จให้ส่ง response กลับ
//   } catch (err : any) {
//     setIsLoading(false);  // หยุดสถานะการโหลดเมื่อเกิดข้อผิดพลาด

//     // ตรวจสอบ error เพื่อแสดงข้อความที่เข้าใจได้ง่าย
//     const errorMsg = err?.response?.data?.message || "An unexpected error occurred. Please try again later.";
//     console.error("Registration Error:", errorMsg);
//     return { error: true, msg: errorMsg };
//   }
// };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      console.log("📷 ~ file: AuthContext.tsx:41 ~ login ~ result:", result);

      console.log(result.data.username);
      
      setAuthState({
        token: result.data.accessToken,
        authenticated: true,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.accessToken}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);

      return result;
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = "An unknown error occurred";

      if (status === 401) {
        errorMsg = "Please check your email or your password.";
      } else if (status === 400) {
        errorMsg = "Bad request. Please check the input.";
      } else if (status === 500) {
        errorMsg = "Server error. Please try again later.";
      } else {
        errorMsg = err?.response?.data?.msg || errorMsg;
      }

      console.log("Error in login:", errorMsg);
      return { error: true, msg: errorMsg };
    }
  };

  const logout = async () => {
    //Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    //Update TTP Headers
    axios.defaults.headers.common["Authorization"] = "";

    //Reset Auth State
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
