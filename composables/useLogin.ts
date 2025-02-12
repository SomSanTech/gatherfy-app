// src/hooks/useLogin.ts
import { useState } from 'react';
import API from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await API.post("/login", { username, password });
      const token  = response.data.accessToken;
      await AsyncStorage.setItem("token", token); // Save token locally
      setIsLoading(false);
      return token; // Return data on success
    } catch (err) {
      setIsLoading(false);
      setError("Login failed. Please try again.");
      throw err; // Re-throw error for further handling
    }
  };
  

  return {
    isLoading,
    error,
    login,
  };
};

export default useLogin;
