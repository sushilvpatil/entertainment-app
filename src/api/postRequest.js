import axiosInstanceWithoutToken from "./axiosInstance";

export const postRequest = async (endpoint, data, config = {}) => {
  try {
    const response = await axiosInstanceWithoutToken.post(endpoint, data, config);
    return response; // Return only data from response
  } catch (error) {
    throw error.response || { data: { message: "Something went wrong!" } };
  }
};

