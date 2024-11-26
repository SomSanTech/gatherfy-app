import React, { Fragment, useEffect, useState } from "react";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { useAppContext } from "../components/AppContext";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ||
  'http://cp24us1.sit.kmutt.ac.th:8080'

const API_HOST_IOS = "http://cp24us1.sit.kmutt.ac.th:8080";
const API_HOST_ANDROID = "http://cp24us1.sit.kmutt.ac.th:8080";
const apiURL = Platform.OS === "ios" ? API_HOST_IOS : API_HOST_ANDROID;


export const fetchData = async (page: string, search?: string) => {
  try {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined in the app's configuration.");
      return [];
    }

    let url = `${API_BASE_URL}/api/v1/events`;
    
    if (page === "home") {
        console.log("Fetching from URL:", url);
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
        return  data; // Return the resolved data
      
    }

    if (page === "search" && search) {
      url = `${url}?keyword=${encodeURIComponent(search)}`;
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
    }else if (page === "search" && !search) {
        console.log("No search keyword provided.");
        return [];
      }
  } catch (error) {
    console.error("Error fetching events:", error);
  } finally {
  }
};
