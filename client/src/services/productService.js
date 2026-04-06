import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const productApi = axios.create({
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

  return "Something went wrong while fetching products.";
};

const getProducts = async ({ search, category } = {}) => {
  try {
    const params = {};

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    const response = await productApi.get("/products", { params });

    return {
      products: response.data?.data?.products || [],
      count: response.data?.data?.count || 0
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const getProductById = async (productId) => {
  try {
    const response = await productApi.get(`/products/${productId}`);
    return response.data?.data?.product || null;
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const getCategories = async () => {
  try {
    const response = await productApi.get("/categories");
    return response.data?.data?.categories || [];
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { getCategories, getProductById, getProducts };
