import { Link, router } from "expo-router";

export const backToIndex = () => {
  router.dismissAll();
  router.replace("/");
};
