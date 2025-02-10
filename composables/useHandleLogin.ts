import { useRouter } from "expo-router";

export const useHandleLogin = () => {
  const router = useRouter();

  return () => {
    router.dismissAll() 
    console.log("Login");
    router.replace("/home");
  };
};
