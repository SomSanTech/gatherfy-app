import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (username: string, password: string) => Promise<any>;
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

  const register = async (username: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/signup`, {
        username,
        password,
      });
    } catch (err) {
      return { error: true, msg: (err as any).response.data.message };
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      console.log("📷 ~ file: AuthContext.tsx:41 ~ login ~ result:", result);

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
