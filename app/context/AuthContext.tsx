import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  Alert,
  Modal,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";
import { set } from "lodash";
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as jose from "jose";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { Colors } from "@/constants/Colors";

import { useNavigation } from "@react-navigation/native";

interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
    verifyEmail?: boolean | null | undefined;
  };
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
  updateProfile?: (
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: string | undefined,
    gender: string,
    image?: string
  ) => Promise<any>;
  onVerifiedEmail?: (check: boolean) => Promise<void>;
  onLogin?: (username: string, password: string) => Promise<any>;
  onLoginGoogle?: () => Promise<any>;
  onLogout?: () => void;
}

const TOKEN_KEY = "my-jwt";
const Refresh_TOKEN_KEY = "refresh-token";
const usernameStorage = "username";
const firstnameStorage = "firstname";
const lastnameStorage = "lastname";
const emailStorage = "email";
const roleStorage = "role";
const isVerifiedStorage = "is_verified";

// const API_URL = "https://capstone24.sit.kmutt.ac.th/us1";

const API_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

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
    verifyEmail?: boolean | null;
  }>({
    token: null,
    authenticated: null,
    verifyEmail: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const isVerified = await SecureStore.getItemAsync(isVerifiedStorage);

      if (token) {
        const decoded: any = jwtDecode(token); // ✅ Now it works
        const isExpired = decoded.exp * 1000 < Date.now(); // Check expiration time

        if (isExpired) {
          console.log("Token expired, logging out...");
          await logout();
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setAuthState({
          token,
          authenticated: true,
          verifyEmail: isVerified ? JSON.parse(isVerified) : false, // Convert string to boolean
        });
      }
    };

    loadToken();

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("🚨 Interceptor triggered:", error.response.status);

        const originalRequest = error.config;

        // ถ้า request เป็น /login หรือ /refresh → ไม่ต้องพยายาม refresh token
        if (
          originalRequest.url?.includes("/login") ||
          originalRequest.url?.includes("/refresh")
        ) {
          console.log(
            "⚠️ Login or Refresh request failed, skipping refresh token."
          );
          return Promise.reject(error);
        }

        if (error.response?.status === 401) {
          console.log("🔄 Token expired, trying to refresh...");

          try {
            const refreshToken = await SecureStore.getItemAsync(
              "refresh-token"
            );
            console.log("🔑 Stored refreshToken:", refreshToken); // Debugging

            if (!refreshToken) throw new Error("No refresh token");

            const res = await axios.post(`${API_URL}/api/v1/refresh`, {
              refreshToken,
            });

            const newToken = res.data.accessToken;

            await SecureStore.setItemAsync(TOKEN_KEY, newToken);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;

            return axios(originalRequest);
          } catch (refreshError) {
            console.error("❌ Failed to refresh token:", refreshError);
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); // Clean up when component unmounts
    };
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
      const response = await axios.post(`${API_URL}/api/v1/signup`, {
        role,
        username,
        firstname,
        lastname,
        email,
        phone,
        birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss"),
        gender,
        password,
      });
      return response; // ถ้าสำเร็จให้ส่ง response กลับ
    } catch (err: any) {
      // ตรวจสอบ error เพื่อแสดงข้อความที่เข้าใจได้ง่าย
      const errorMsg =
        err?.response?.data?.message ||
        "An unexpected error occurred. Please try again later."; //แก้ให้ error แสดงข้อความที่เข้าใจว่า error อะไร
      console.error("Registration Error:", errorMsg);
      return { error: true, msg: errorMsg };
    }
  };

  const updateProfile = async (
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    birthday: string | undefined,
    gender: string,
    image?: string
  ) => {

    try {
      const requestData: any = {
        username,
        firstname,
        lastname,
        email,
        phone,
        birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss"),
        gender,
      };

      if (image) {
        requestData.image = image;
      }

      // Update profile on the backend
      const response = await axios.put(
        `${API_URL}/api/v1/profile`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );

      if (response.data) {
        // Update the information in SecureStore
        await SecureStore.setItemAsync(usernameStorage, username);
        await SecureStore.setItemAsync(firstnameStorage, firstname);
        await SecureStore.setItemAsync(lastnameStorage, lastname);
        await SecureStore.setItemAsync(emailStorage, email);

        // Update the context and authentication state
        setAuthState((prevState) => ({
          ...prevState,
          username,
          firstname,
          lastname,
          email,
        }));

        // Return response to the calling function
        return response;
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Error updating profile";
      console.error("Error updating profile:", errorMsg);
      return { error: false, msg: errorMsg };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/api/v1/login`, {
        username,
        password,
      });

      // Fetch user profile after successful login
      const profileResponse = await axios.get(`${API_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${result.data.accessToken}`,
        },
      });

      // Assuming the API returns user data in the response
      const userProfile = profileResponse.data;

      setAuthState({
        token: result.data.accessToken,
        authenticated: true,
        verifyEmail: userProfile.is_verified,
      });

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${result.data.accessToken}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
      await SecureStore.setItemAsync(
        Refresh_TOKEN_KEY,
        result.data.refreshToken
      );
      await SecureStore.setItemAsync(usernameStorage, userProfile.username);
      await SecureStore.setItemAsync(
        firstnameStorage,
        userProfile.users_firstname
      );
      await SecureStore.setItemAsync(
        lastnameStorage,
        userProfile.users_lastname
      );
      await SecureStore.setItemAsync(emailStorage, userProfile.users_email);
      await SecureStore.setItemAsync(roleStorage, userProfile.users_role);
      await SecureStore.setItemAsync(
        isVerifiedStorage,
        JSON.stringify(userProfile.is_verified)
      );

      return result;
    } catch (err: any) {
      const status = err?.response?.status;
      let errorMsg = "An unknown error occurred";

      if (status === 401) {
        errorMsg = "Your email or your password was incorrect.";
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

  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    profileImageSize: 150,
  });

  const handleGoogleLoginWithToken = async (responseIdToken: string) => {
    const decodedToken = jose.decodeJwt(responseIdToken);
    const expiredGoogleToken = decodedToken.exp
      ? decodedToken.exp * 1000 < Date.now()
      : true;

    if (expiredGoogleToken) {
      console.log("Google token expired");
      return;
    }

    try {
      const result = await axios.post(
        `${API_URL}/api/v1/login/google`,
        {},
        {
          headers: {
            Authorization: `Bearer ${responseIdToken}`,
          },
        }
      );

      const profileResponse = await axios.get(`${API_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${result.data.accessToken}`,
        },
      });

      const userProfile = profileResponse.data;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
      await SecureStore.setItemAsync(
        Refresh_TOKEN_KEY,
        result.data.refreshToken
      );
      await SecureStore.setItemAsync(
        isVerifiedStorage,
        JSON.stringify(userProfile.is_verified)
      );

      setAuthState({
        token: result.data.accessToken,
        authenticated: true,
        verifyEmail: userProfile.is_verified,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.log("Google token not registered");
        setCachedToken(responseIdToken);
        openRoleModal(); 
      } else {
        throw error;
      }
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "Attendee" | "Organizer" | null
  >(null);
  const [cachedToken, setCachedToken] = useState<string | null>(null);

  const openRoleModal = () => setModalVisible(true);

  const registerGoogleUser = async (token: string, role: string) => {
    const registerGoogle = await axios.post(
      `${API_URL}/api/v1/signup/google`,
      { token, role },
      { validateStatus: () => true }
    );

    if (registerGoogle.status === 200) {
      Alert.alert("Success", "Registered successfully", [
        {
          text: "OK",
          onPress: async () => {
            try {
              await handleGoogleLoginWithToken(token);
            } catch (e) {
              console.error("Login failed after register:", e);
            }
          },
        },
      ]);
    }
  };

  const setRoleFromUI = (role: "Attendee" | "Organizer") => {
    setSelectedRole(role);
    setModalVisible(false);
    if (cachedToken) {
      registerGoogleUser(cachedToken, role);
    }
  };

  const loginWithGoogle = async () => {

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
   
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();

    if (!isSuccessResponse(response)) return;

    const { idToken } = await GoogleSignin.getTokens();
    await GoogleSignin.clearCachedAccessToken(idToken); 


    if (!idToken) {
      console.error("Google Sign-In responseIdToken is null");
      return;
    }

    try {
      await handleGoogleLoginWithToken(idToken);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    //Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(Refresh_TOKEN_KEY);
    await SecureStore.deleteItemAsync(usernameStorage);
    await SecureStore.deleteItemAsync(firstnameStorage);
    await SecureStore.deleteItemAsync(lastnameStorage);
    await SecureStore.deleteItemAsync(emailStorage);
    await SecureStore.deleteItemAsync(roleStorage);
    await SecureStore.deleteItemAsync(isVerifiedStorage);
    //Update TTP Headers
    axios.defaults.headers.common["Authorization"] = "";

    //Reset Auth State
    setAuthState({
      token: null,
      authenticated: false,
      verifyEmail: false,
    });
  };

  const verifiedEmail = async (check: boolean) => {
    if (!check) {
      console.log("Email not verified");
      return;
    }
    console.log("Email verified");
    await SecureStore.setItemAsync(isVerifiedStorage, check ? "true" : "false");
    setAuthState((prevState) => ({
      ...prevState,
      verifyEmail: true,
    }));
  };

  const value = {
    onRegister: register,
    updateProfile: updateProfile,
    onLogin: login,
    onLoginGoogle: loginWithGoogle,
    onLogout: logout,
    onVerifiedEmail: verifiedEmail,
    authState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose an option</Text>
              <View style={styles.modalContentList}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setRoleFromUI("Attendee")}
                >
                  <Text style={styles.optionText}>Attendee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setRoleFromUI("Organizer")}
                >
                  <Text style={styles.optionText}>Organizer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 10,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    includeFontPadding: false,
    textAlign: "center",
    marginBottom: 10,
  },
  modalContentList: {
    flexDirection: "row", // จัดเรียงปุ่มในแนวนอน
    justifyContent: "space-around", // จัดระยะห่างระหว่างปุ่ม
    width: "100%",
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  optionButton: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    flex: 1, // ใช้ flex เพื่อให้ปุ่มขยายได้
    marginHorizontal: 5, // ให้มีช่องว่างระหว่างปุ่ม
    marginTop: 10, // ให้มีช่องว่างระหว่างปุ่ม
    justifyContent: "center", // จัดให้ข้อความอยู่ตรงกลาง
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    includeFontPadding: false,
  },
});
