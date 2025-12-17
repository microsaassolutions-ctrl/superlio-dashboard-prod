import axios from "axios";
import { errorToaster, warningToaster } from "../utils/toaster";
import { apiURL, redirectionUrl  } from "../utils/config";
import { getCookieValue } from "../utils/helpers";
import useMainStore from "../store/useMainStore";

const axiosInstance = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});
let isFetchingUser = false;

axiosInstance.interceptors.request.use(async (config) => {
  const token = getCookieValue("superlio_token");
  // console.log(token,'----token---')
    
    // const token = false ? "MTRlYzI0NWUyYTJlNTJiYzBmNjVmMzY0NmFlNmYzZGIwMDBjOWFmZjA3NGQxYjFlMjM5NzY2NWM3NjRhY2Q1Mjo6eyJpZCI6ODV9" : "MTRlYzI0NWUyYTJlNTJiYzBmNjVmMzY0NmFlNmYzZGIwMDBjOWFmZjA3NGQxYjFlMjM5NzY2NWM3NjRhY2Q1Mjo6eyJpZCI6ODV9"

    // ############## LocalStorage ####### 
  console.log('----Cookie -----axiosinstance',token);
  const localToken = localStorage.getItem("superlioAccessToken");

  if (config.url.includes('/content/auth')) {
    localStorage.setItem("superlioAccessToken", token);
  } else if (localToken !== token) {

    localStorage.setItem("superlioAccessToken", token);

    if (!isFetchingUser) {
      isFetchingUser = true;

      try {
        await useMainStore.getState().getAuth();
        useMainStore.getState().setShowLoginRedirectBox(false);
      } catch (err) {
        console.error("Failed to fetch user after token mismatch", err);
        useMainStore.getState().setShowLoginRedirectBox(true);
        // window.location.href = redirectionUrl;
      } finally {
        isFetchingUser = false;
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const user = useMainStore.getState()?.data?.settings;
  if (user.id) {
    config.headers['x-user-id'] = user.id;
  }

  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const requestUrl = response.config?.url;
    if (requestUrl.includes('/content/auth')) {
      const userCokkie = response.headers['x-user'];
      localStorage.setItem("superlioAccessToken", userCokkie);
    }
    return response;
  },
  async (error) => {
    const suppressErrors = error.config?.suppressErrors;
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        if (!suppressErrors) errorToaster("Unauthorized! Please log in again.");
        useMainStore.getState().setShowLoginRedirectBox(true);
        // window.location.href = redirectionUrl;
        console.warn("Unauthorized! Redirecting to login...");
      } else if (status === 402) {
        // window.location.href = data.redirectUrl;
        useMainStore.getState().setShowLoginRedirectBox(true);
        console.warn("Unauthorized! Redirecting to login...");
      }
      else if (status === 403) {
        if (!suppressErrors) warningToaster("Forbidden: You do not have permission.");
      } else if (status === 500) {
        if (!suppressErrors) errorToaster("Server error, please try again later.");
      } else {
        if (!suppressErrors) errorToaster(data?.message || "Something went wrong.");
      }
    } else if (error.code === "ERR_NETWORK") {
      if (!suppressErrors) errorToaster("Network error! Check your internet connection.");
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
