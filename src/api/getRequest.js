import axiosInstanceWithoutToken from "./axiosInstance";
export const getRequest = async (endpoint, config = {}) => {
  try {
    // Debug log for endpoint
    const response = await axiosInstanceWithoutToken.get(endpoint, config);
    return response.data; // Return only data from response
  } catch (error) {
    // Throw full error object instead of just message
    throw error.response || { data: { message: "Something went wrong!" } };
  }
};
