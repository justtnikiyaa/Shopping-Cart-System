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

  return "Something went wrong while handling orders.";
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

const getMyOrdersApi = async (token) => {
  try {
    const response = await orderApi.get("/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return {
      orders: response.data?.data?.orders || [],
      count: response.data?.data?.count || 0,
      message: response.data?.message || "Orders fetched successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { getMyOrdersApi, placeOrderApi };
