import Constants from "expo-constants";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";

export const getTag = async () => {
  let url = `${API_BASE_URL}/api/v1/tags`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  
  return data;
};
