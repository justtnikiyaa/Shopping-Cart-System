import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const mapAuthResponse = (response) => {
  const { data } = response;

  if (!data?.success || !data?.data?.token || !data?.data?.user) {
    throw new Error("Unexpected API response format");
  }

  return {
    token: data.data.token,
    user: data.data.user,
    message: data.message || "Success"
  };
};

const mapApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const registerUser = async (payload) => {
  try {
    const response = await authApi.post("/auth/register", payload);
    return mapAuthResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const loginUser = async (payload) => {
  try {
    const response = await authApi.post("/auth/login", payload);
    return mapAuthResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { loginUser, registerUser };
