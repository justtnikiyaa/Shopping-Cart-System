import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const orderApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const mapApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong while placing order.";
};

const placeOrderApi = async ({ token, shippingAddress }) => {
  try {
    const response = await orderApi.post(
      "/orders/checkout",
      { shippingAddress },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      order: response.data?.data?.order || null,
      message: response.data?.message || "Order placed successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { placeOrderApi };
