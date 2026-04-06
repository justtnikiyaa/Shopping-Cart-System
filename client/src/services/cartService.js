import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const cartApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const mapApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong while updating cart.";
};

const normalizeCartResponse = (response) => ({
  cart: response.data?.data?.cart || {
    items: [],
    totalItems: 0,
    totalAmount: 0
  },
  message: response.data?.message || "Cart updated"
});

const fetchCartApi = async (token) => {
  try {
    const response = await cartApi.get("/cart", getAuthConfig(token));
    return normalizeCartResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const addCartItemApi = async ({ token, productId, quantity }) => {
  try {
    const response = await cartApi.post(
      "/cart/items",
      { productId, quantity },
      getAuthConfig(token)
    );

    return normalizeCartResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const updateCartItemApi = async ({ token, productId, quantity }) => {
  try {
    const response = await cartApi.put(
      `/cart/items/${productId}`,
      { quantity },
      getAuthConfig(token)
    );

    return normalizeCartResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const removeCartItemApi = async ({ token, productId }) => {
  try {
    const response = await cartApi.delete(`/cart/items/${productId}`, getAuthConfig(token));
    return normalizeCartResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const clearCartApi = async (token) => {
  try {
    const response = await cartApi.delete("/cart", getAuthConfig(token));
    return normalizeCartResponse(response);
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { addCartItemApi, clearCartApi, fetchCartApi, removeCartItemApi, updateCartItemApi };
