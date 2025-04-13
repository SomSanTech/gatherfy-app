import Constants from "expo-constants";
import { Platform } from "react-native";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  "https://capstone24.sit.kmutt.ac.th";


// const API_BASE_URL =
//   Platform.OS === "android" ? "http://10.0.2.2:4040" : "http://localhost:4040";

export const getEvent = async (
  page: string,
  search?: string,
  slug?: string,
  tag?: string,
  date?: string,
  sort?: string
) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/events`;

    if (page === "home") {
      url = `${url}?sort=date_desc`;
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
      
      const data = await response.json(); // Await here to resolve the promise

      return data; // Return the resolved data
    }
    if (page === "homeSlide") {
      url = `${url}/recommended`;
      
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

      const data = await response.json(); // Await here to resolve the promise

      return data; // Return the resolved data
    }


    if (page === "search" || page === "tag") {
      // Set default values if undefined
      const searchParam = search || "";
      const sortParam = sort || "";
      const dateParam = date || "";
      const tagParam = tag || "";

      url = `${url}?keyword=${encodeURIComponent(
        searchParam
      )}&sort=${sortParam}&date=${dateParam}&tags=${tagParam}`;

      console.log("Fetching search with URL:", url);
      
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

      console.log("Search Fetching from URL:", url);
      const data = await response.json(); // Await here to resolve the promise
      return data; // Return the resolved data
    } else if (page === "search" && !search) {
      console.log("No search keywords provided.");
    }

    if (page === "detail") {
      console.log("Fetching detail with slug:", slug);

      url += `/${slug}`;
      const response = await fetch(url);
      console.log("Fetching detail from URL:", url);

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
  }
};


export const countViewById = async (url: string) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    const urlToCount = `${API_BASE_URL}${url}`;

    const response = await fetch(urlToCount, {
      method: "POST",
      headers: {
        Accept: "text/plain",  // Expecting plain text response from backend
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text(); // Capture and log error response body
      console.error("Error response body:", errorText);
      return [];
    }

    // Read the response as text if it's plain text
    const text = await response.text();

    // You can return the plain text or do something with it
    return text; // Returning the plain text response

  } catch (error) {
    console.error("Error fetching events:", error);
  }
};
