import axiosInstance from "./axiosInstance";

export const get = async (endpoint, params = {}, suppressErrors = false) => {
  try {
    const response = await axiosInstance.get(endpoint, { params, suppressErrors });
    return response.data;
  } catch (error) {
    if (!suppressErrors) {
      console.error("Error fetching data:", error);
    }
    throw error;
  }
};

export const post = async (endpoint, data, suppressErrors = false) => {
  try {
    const response = await axiosInstance.post(endpoint, data, { suppressErrors });
    return response.data;
  } catch (error) {
    if (!suppressErrors) {
      console.error("Error posting data:", error);
    }
    throw error;
  }
};

export const deleteReq = async (endpoint, data, suppressErrors = false) => {
  try {
    const response = await axiosInstance.delete(endpoint, { data, suppressErrors });
    return response.data;
  } catch (error) {
    if (!suppressErrors) {
      console.error("Error deleting data:", error);
    }
    throw error;
  }
};
