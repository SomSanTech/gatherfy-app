import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import Constants from "expo-constants";
import { set } from "lodash";

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
      console.log("User Profile:", userProfile.users_email);

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

  const logout = async () => {
    //Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(usernameStorage);
    await SecureStore.deleteItemAsync(firstnameStorage);
    await SecureStore.deleteItemAsync(lastnameStorage);
    await SecureStore.deleteItemAsync(emailStorage);
    await SecureStore.deleteItemAsync(roleStorage);

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
    onLogout: logout,
    onVerifiedEmail: verifiedEmail,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import * as SecureStore from "expo-secure-store";
// import { Platform } from "react-native";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";
// import Constants from "expo-constants";
// import { set } from "lodash";

// import * as WebBrowser from "expo-web-browser";
// import { AuthError } from "expo-auth-session";

// WebBrowser.maybeCompleteAuthSession();

// export type AuthUserGoogle = {
//   id: string;
//   email: string;
//   name: string;
//   picture?: string;
//   given_name?: string;
//   family_name?: string;
//   email_verified?: boolean;
//   provider?: string;
//   exp?: number;
//   cookieExpiration?: number; // Added for cookie expiration
// };

// interface AuthProps {
//   authState?: {
//     token: string | null;
//     authenticated: boolean | null;
//     verifyEmail?: boolean | null | undefined;
//   };
//   onRegister?: (
//     role: string,
//     username: string,
//     firstname: string,
//     lastname: string,
//     email: string,
//     phone: string,
//     birthday: string | undefined,
//     gender: string,
//     password: string
//   ) => Promise<any>;
//   updateProfile?: (
//     username: string,
//     firstname: string,
//     lastname: string,
//     email: string,
//     phone: string,
//     birthday: string | undefined,
//     gender: string,
//     image?: string
//   ) => Promise<any>;
//   onVerifiedEmail?: (check: boolean) => Promise<void>;
//   onLogin?: (username: string, password: string) => Promise<any>;
//   onLogout?: () => void;
// }

// const TOKEN_KEY = "my-jwt";
// const usernameStorage = "username";
// const firstnameStorage = "firstname";
// const lastnameStorage = "lastname";
// const emailStorage = "email";
// const roleStorage = "role";
// const isVerifiedStorage = "is_verified";

// // const API_URL = "https://capstone24.sit.kmutt.ac.th/us1";

// const API_URL =
//   Constants.expoConfig?.extra?.apiBaseUrl ||
//   "https://capstone24.sit.kmutt.ac.th";

// export { API_URL };

// // export const API_URL = "https://api.developbetterapps.com";
// const AuthContext = createContext<AuthProps>({});

// const AuthContextGoogle = createContext({
//   user: null as AuthUserGoogle | null,
//   signIn: () => {},
//   signOut: () => {},
//   fetchWithAuth: async (url: string, options?: RequestInit) =>
//     Promise.resolve(new Response()),
//   isLoading: false,
//   error: null as AuthError | null,
// });
// export const AuthProviderGoogle = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [user, setUser] = useState<AuthUserGoogle | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<AuthError | null>(null);

//   const signIn = async () => {};

//   const signOut = async () => {};

//   const fetchWithAuth = async (url: string, options?: RequestInit) => {};

//   return (
//     <AuthContextGoogle.Provider
//       value={{
//         user,
//         signIn,
//         signOut,
//         fetchWithAuth,
//         isLoading,
//         error,
//       }}
//     >
//       {children}
//     </AuthContextGoogle.Provider>
//   );
// };

// export const useAuthGoogle = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }: any) => {
//   const [authState, setAuthState] = useState<{
//     token: string | null;
//     authenticated: boolean | null;
//     verifyEmail?: boolean | null;
//   }>({
//     token: null,
//     authenticated: null,
//     verifyEmail: null,
//   });

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await SecureStore.getItemAsync(TOKEN_KEY);
//       const isVerified = await SecureStore.getItemAsync(isVerifiedStorage);

//       if (token) {
//         const decoded: any = jwtDecode(token); // ✅ Now it works
//         const isExpired = decoded.exp * 1000 < Date.now(); // Check expiration time

//         if (isExpired) {
//           console.log("Token expired, logging out...");
//           await logout();
//           return;
//         }

//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//         setAuthState({
//           token,
//           authenticated: true,
//           verifyEmail: isVerified ? JSON.parse(isVerified) : false, // Convert string to boolean
//         });
//       }
//     };

//     loadToken();

//     // Setup axios interceptor
//     // const interceptor = axios.interceptors.response.use(
//     //   (response) => response,
//     //   async (error) => {
//     //     console.log("🚨 Interceptor triggered:", error.response); // Debugging

//     //     if (error.response?.status === 401) {
//     //       // Unauthorized
//     //       console.log("🔄 Token expired, trying to refresh...");

//     //       try {
//     //         const refreshToken = await SecureStore.getItemAsync(
//     //           "refresh-token"
//     //         );
//     //         console.log("🔑 Stored refreshToken:", refreshToken); // Debugging

//     //         if (!refreshToken) throw new Error("No refresh token");

//     //         const res = await axios.post(`${API_URL}/api/v1/refresh`, {
//     //           refreshToken,
//     //         });
//     //         console.log("✅ Token refreshed:", res.data.accessToken); // Debugging

//     //         const newToken = res.data.accessToken;

//     //         await SecureStore.setItemAsync(TOKEN_KEY, newToken);
//     //         axios.defaults.headers.common[
//     //           "Authorization"
//     //         ] = `Bearer ${newToken}`;

//     //         return axios(error.config); // Retry the original request
//     //       } catch (refreshError) {
//     //         console.error("❌ Failed to refresh token:", refreshError);
//     //         logout();
//     //       }
//     //     }
//     //     return Promise.reject(error);
//     //   }
//     // );
//     const interceptor = axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         console.log("🚨 Interceptor triggered:", error.response.status);

//         const originalRequest = error.config;

//         // ถ้า request เป็น /login หรือ /refresh → ไม่ต้องพยายาม refresh token
//         if (
//           originalRequest.url?.includes("/login") ||
//           originalRequest.url?.includes("/refresh")
//         ) {
//           console.log(
//             "⚠️ Login or Refresh request failed, skipping refresh token."
//           );
//           return Promise.reject(error);
//         }

//         if (error.response?.status === 401) {
//           console.log("🔄 Token expired, trying to refresh...");

//           try {
//             const refreshToken = await SecureStore.getItemAsync(
//               "refresh-token"
//             );

//             if (!refreshToken) throw new Error("No refresh token");

//             const res = await axios.post(`${API_URL}/api/v1/refresh`, {
//               refreshToken,
//             });

//             const newToken = res.data.accessToken;

//             await SecureStore.setItemAsync(TOKEN_KEY, newToken);
//             axios.defaults.headers.common[
//               "Authorization"
//             ] = `Bearer ${newToken}`;

//             return axios(originalRequest);
//           } catch (refreshError) {
//             console.error("❌ Failed to refresh token:", refreshError);
//             logout();
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptor); // Clean up when component unmounts
//     };
//   }, []);

//   const register = async (
//     role: string,
//     username: string,
//     firstname: string,
//     lastname: string,
//     email: string,
//     phone: string,
//     birthday: string | undefined,
//     gender: string,
//     password: string
//   ) => {
//     try {
//       const response = await axios.post(`${API_URL}/api/v1/signup`, {
//         role,
//         username,
//         firstname,
//         lastname,
//         email,
//         phone,
//         birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss"),
//         gender,
//         password,
//       });
//       return response; // ถ้าสำเร็จให้ส่ง response กลับ
//     } catch (err: any) {
//       // ตรวจสอบ error เพื่อแสดงข้อความที่เข้าใจได้ง่าย
//       const errorMsg =
//         err?.response?.data?.message ||
//         "An unexpected error occurred. Please try again later."; //แก้ให้ error แสดงข้อความที่เข้าใจว่า error อะไร
//       console.error("Registration Error:", errorMsg);
//       return { error: true, msg: errorMsg };
//     }
//   };

//   const updateProfile = async (
//     username: string,
//     firstname: string,
//     lastname: string,
//     email: string,
//     phone: string,
//     birthday: string | undefined,
//     gender: string,
//     image?: string
//   ) => {
//     const urlToFetch = `${API_URL}/api/v1/profile`;
//     console.log("urlToFetch", urlToFetch);

//     console.log("imagee", image);

//     try {
//       const requestData: any = {
//         username,
//         firstname,
//         lastname,
//         email,
//         phone,
//         birthday: dayjs(birthday).format("YYYY-MM-DDTHH:mm:ss"),
//         gender,
//       };

//       if (image) {
//         requestData.image = image;
//       }

//       // Update profile on the backend
//       const response = await axios.put(
//         `${API_URL}/api/v1/profile`,
//         requestData,
//         {
//           headers: {
//             Authorization: `Bearer ${authState.token}`,
//           },
//         }
//       );

//       if (response.data) {
//         // Update the information in SecureStore
//         await SecureStore.setItemAsync(usernameStorage, username);
//         await SecureStore.setItemAsync(firstnameStorage, firstname);
//         await SecureStore.setItemAsync(lastnameStorage, lastname);
//         await SecureStore.setItemAsync(emailStorage, email);

//         // Update the context and authentication state
//         setAuthState((prevState) => ({
//           ...prevState,
//           username,
//           firstname,
//           lastname,
//           email,
//         }));

//         // Return response to the calling function
//         return response;
//       }
//     } catch (err: any) {
//       const errorMsg = err?.response?.data?.message || "Error updating profile";
//       console.error("Error updating profile:", errorMsg);
//       return { error: true, msg: errorMsg };
//     }
//   };

//   const login = async (username: string, password: string) => {
//     try {
//       const result = await axios.post(`${API_URL}/api/v1/login`, {
//         username,
//         password,
//       });

//       // Fetch user profile after successful login
//       const profileResponse = await axios.get(`${API_URL}/api/v1/profile`, {
//         headers: {
//           Authorization: `Bearer ${result.data.accessToken}`,
//         },
//       });

//       // Assuming the API returns user data in the response
//       const userProfile = profileResponse.data;
//       console.log("User Profile:", userProfile.users_email);

//       setAuthState({
//         token: result.data.accessToken,
//         authenticated: true,
//         verifyEmail: userProfile.is_verified,
//       });

//       axios.defaults.headers.common[
//         "Authorization"
//       ] = `Bearer ${result.data.accessToken}`;

//       await SecureStore.setItemAsync(TOKEN_KEY, result.data.accessToken);
//       await SecureStore.setItemAsync(usernameStorage, userProfile.username);
//       await SecureStore.setItemAsync(
//         firstnameStorage,
//         userProfile.users_firstname
//       );
//       await SecureStore.setItemAsync(
//         lastnameStorage,
//         userProfile.users_lastname
//       );
//       await SecureStore.setItemAsync(emailStorage, userProfile.users_email);
//       await SecureStore.setItemAsync(roleStorage, userProfile.users_role);
//       await SecureStore.setItemAsync(
//         isVerifiedStorage,
//         JSON.stringify(userProfile.is_verified)
//       );

//       return result;
//     } catch (err: any) {
//       const status = err?.response?.status;
//       let errorMsg = "An unknown error occurred";

//       if (status === 401) {
//         errorMsg = "Your email or your password was incorrect.";
//       } else if (status === 400) {
//         errorMsg = "Bad request. Please check the input.";
//       } else if (status === 500) {
//         errorMsg = "Server error. Please try again later.";
//       } else {
//         errorMsg = err?.response?.data?.msg || errorMsg;
//       }

//       console.log("Error in login:", errorMsg);
//       return { error: true, msg: errorMsg };
//     }
//   };

//   const logout = async () => {
//     //Delete token from storage
//     await SecureStore.deleteItemAsync(TOKEN_KEY);
//     await SecureStore.deleteItemAsync(usernameStorage);
//     await SecureStore.deleteItemAsync(firstnameStorage);
//     await SecureStore.deleteItemAsync(lastnameStorage);
//     await SecureStore.deleteItemAsync(emailStorage);
//     await SecureStore.deleteItemAsync(roleStorage);

//     //Update TTP Headers
//     axios.defaults.headers.common["Authorization"] = "";

//     //Reset Auth State
//     setAuthState({
//       token: null,
//       authenticated: false,
//       verifyEmail: false,
//     });
//   };

//   const verifiedEmail = async (check: boolean) => {
//     if (!check) {
//       console.log("Email not verified");
//       return;
//     }
//     console.log("Email verified");
//     await SecureStore.setItemAsync(isVerifiedStorage, check ? "true" : "false");
//     setAuthState((prevState) => ({
//       ...prevState,
//       verifyEmail: true,
//     }));
//   };

//   const value = {
//     onRegister: register,
//     updateProfile: updateProfile,
//     onLogin: login,
//     onLogout: logout,
//     onVerifiedEmail: verifiedEmail,
//     authState,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
