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
import { Platform } from "react-native";
import * as jose from "jose";
import { set } from "lodash";

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
const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signIn: () => {},
  signOut: () => {},
  fetchWithAuth: async (url: string, options?: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
});

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: ["openid", "profile", "email"],
  redirectUri: makeRedirectUri(),
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/apiGoogle/authGoogle/authorize`,
  tokenEndpoint: `${BASE_URL}/apiGoogle/authGoogle/token`,
};

export const AuthProviderGoogle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [idToken, setIdToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<AuthError | null>(null);

  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const isWeb = Platform.OS === "web";

  React.useEffect(() => {
    handleResponse();
  }, [response]);

  interface DecodedJwt {
    exp?: number; // Optional property in case it's not always present
    [key: string]: any; // Allow other properties
  }

  const handleResponse = async () => {
    if (response?.type === "success") {
      const { code } = response.params;

      try {
        setIsLoading(true);
        // You can also use excjangeCodeAsync from expo-auth-session to exchange the code for tokens
        const tokenResponse = await exchangeCodeAsync(
          {
            code: code,
            extraParams: {
              platform: Platform.OS,
            },
            clientId: "google",
            redirectUri: makeRedirectUri(),
          },
          discovery
        );

        const idTokenResponse = tokenResponse.idToken;

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

        const tokenIsExpired = isTokenExpired(idTokenResponse ?? "");

        if (!tokenIsExpired) {
          setIdToken(idTokenResponse ?? null);
        } else {
          console.log("Token is expired");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }

      console.log("code", code);
    } else if (response?.type === "error") {
      setError(response.error as AuthError);
    }
  };

  const signIn = async () => {
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

  const signOut = async () => {};

  const fetchWithAuth = async (url: string, options?: RequestInit) => {};

  return (
    <AuthContext.Provider
      value={{

        signIn,
        signOut,
        fetchWithAuth,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthGoogle = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
