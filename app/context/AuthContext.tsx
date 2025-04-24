import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";
import { set } from "lodash";

import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import {
  AuthError,
  AuthRequestConfig,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import { BASE_URL } from "@/utils/constants";
import * as jose from "jose";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  provider?: string;
  exp?: number;
  cookieExpiration?: number; // Added for cookie expiration
};

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
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
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

    // Setup axios interceptor
    // const interceptor = axios.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     console.log("🚨 Interceptor triggered:", error.response); // Debugging

    //     if (error.response?.status === 401) {
    //       // Unauthorized
    //       console.log("🔄 Token expired, trying to refresh...");

    //       try {
    //         const refreshToken = await SecureStore.getItemAsync(
    //           "refresh-token"
    //         );
    //         console.log("🔑 Stored refreshToken:", refreshToken); // Debugging

    //         if (!refreshToken) throw new Error("No refresh token");

    //         const res = await axios.post(`${API_URL}/api/v1/refresh`, {
    //           refreshToken,
    //         });
    //         console.log("✅ Token refreshed:", res.data.accessToken); // Debugging

    //         const newToken = res.data.accessToken;

    //         await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    //         axios.defaults.headers.common[
    //           "Authorization"
    //         ] = `Bearer ${newToken}`;

    //         return axios(error.config); // Retry the original request
    //       } catch (refreshError) {
    //         console.error("❌ Failed to refresh token:", refreshError);
    //         logout();
    //       }
    //     }
    //     return Promise.reject(error);
    //   }
    // );
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
    const urlToFetch = `${API_URL}/api/v1/profile`;
    console.log("urlToFetch", urlToFetch);

    console.log("imagee", image);

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
      return { error: true, msg: errorMsg };
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

  const config: AuthRequestConfig = {
    clientId: "google",
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri(),
  };

  const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${BASE_URL}/apiGoogle/authGoogle/authorize`,
    tokenEndpoint: `${BASE_URL}/apiGoogle/authGoogle/token`,
  };

  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  useEffect(() => {
    handleResponse();
  }, [response]);

  // const handleResponse = async () => {
  //   if (response?.type === "success") {
  //     const { code } = response.params;

  //     try {
  //       setIsLoading(true);
  //       // You can also use excjangeCodeAsync from expo-auth-session to exchange the code for tokens
  //       const tokenResponse = await exchangeCodeAsync(
  //         {
  //           code: code,
  //           extraParams: {
  //             platform: Platform.OS,
  //           },
  //           clientId: "google",
  //           redirectUri: makeRedirectUri(),
  //         },
  //         discovery
  //       );

  //       const idTokenResponse = tokenResponse.idToken;

  //       const isTokenExpired = (token: string) => {
  //         try {
  //           const decodedToken = jose.decodeJwt(token);
  //           const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  //           const isExpired = (decodedToken.exp ?? 0) * 1000 < currentTime; // Check expiration time

  //           return isExpired;
  //         } catch (error) {
  //           console.error("Error decoding token:", error);
  //           return true; // If there's an error, consider the token expired
  //         }
  //       };

  //       const tokenIsExpired = isTokenExpired(idTokenResponse ?? "");

  //       if (!tokenIsExpired) {
  //         await setIdToken(idTokenResponse ?? null);
  //         console.log("Token is valid");
  //         console.log("idTokenResponse", idToken);
  //       } else {
  //         console.log("Token is expired");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false);
  //     }

  //     console.log("code", code);
  //   } else if (response?.type === "error") {
  //     setError(response.error as AuthError);
  //   }
  // };

  const handleResponse = async () => {
    if (response?.type === "success") {
      const { code } = response.params;

      try {
        setIsLoading(true);

        const tokenResponse = await exchangeCodeAsync(
          {
            code,
            extraParams: { platform: Platform.OS },
            clientId: "google",
            redirectUri: makeRedirectUri(),
          },
          discovery
        );

        const idTokenResponse = tokenResponse.idToken;
        if (!idTokenResponse) {
          console.log("No idToken from token response");
          return;
        }

        const isTokenExpired = (token: string) => {
          try {
            const decodedToken = jose.decodeJwt(token);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            const isExpired = (decodedToken.exp ?? 0) * 1000 < currentTime; // Check expiration time

            return isExpired;
          } catch (error) {
            console.error("Error decoding token:", error);
            return true; // If there's an error, consider the token expired
          }
        };
        const isExpired = isTokenExpired(idTokenResponse);
        if (isExpired) {
          console.log("Token is expired");
          return;
        }

        // 👇 ทำทุกอย่างที่ loginGoogle ทำไว้ ที่นี่เลย
        const url = `${API_URL}/api/v1/login/google`;
        const resultLoginGoogle = await axios.post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${idTokenResponse}`,
            },
          }
        );

        const profileResponse = await axios.get(`${API_URL}/api/v1/profile`, {
          headers: {
            Authorization: `Bearer ${resultLoginGoogle.data.accessToken}`,
          },
        });

        await SecureStore.setItemAsync(
          TOKEN_KEY,
          resultLoginGoogle.data.accessToken
        );
        await SecureStore.setItemAsync(
          isVerifiedStorage,
          JSON.stringify(profileResponse.data.is_verified,)
        );
        setAuthState({
          token: resultLoginGoogle.data.accessToken,
          authenticated: true,
          verifyEmail: profileResponse.data.is_verified,
        });
        
      } catch (e) {
        console.log("Google Login Error:", e);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "error") {
      setError(response.error as AuthError);
    }
  };

  useEffect(() => {
    setIdToken(idToken);
  }, [idToken]);

  const loginGoogle = async () => {
    console.log("signIn");
    try {
      if (!request) {
        console.log("No request");
        return;
      }

      await promptAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    //Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
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
    onLoginGoogle: loginGoogle,
    onLogout: logout,
    onVerifiedEmail: verifiedEmail,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
