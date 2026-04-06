import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const productApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const authConfig = (token) => ({
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

  return "Something went wrong while fetching products.";
};

const getProducts = async ({ search, category, page = 1, limit = 9 } = {}) => {
  try {
    const params = {
      page,
      limit
    };

    if (search?.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    const response = await productApi.get("/products", { params });

    return {
      products: response.data?.data?.products || [],
      count: response.data?.data?.count || 0,
      total: response.data?.data?.total || 0,
      pagination: response.data?.data?.pagination || {
        page,
        limit,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      }
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

const createProductApi = async ({ token, payload }) => {
  try {
    const response = await productApi.post("/products", payload, authConfig(token));

    return {
      product: response.data?.data?.product || null,
      message: response.data?.message || "Product created successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const updateProductApi = async ({ token, productId, payload }) => {
  try {
    const response = await productApi.put(`/products/${productId}`, payload, authConfig(token));

    return {
      product: response.data?.data?.product || null,
      message: response.data?.message || "Product updated successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const deleteProductApi = async ({ token, productId }) => {
  try {
    const response = await productApi.delete(`/products/${productId}`, authConfig(token));

    return {
      message: response.data?.message || "Product deleted successfully"
    };
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

export {
  createProductApi,
  deleteProductApi,
  getCategories,
  getProductById,
  getProducts,
  updateProductApi
};
