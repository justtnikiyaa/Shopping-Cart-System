import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categoryApi = axios.create({
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

  return "Something went wrong while managing categories.";
};

const getAllCategoriesApi = async () => {
  try {
    const response = await categoryApi.get("/categories");

    return {
      categories: response.data?.data?.categories || [],
      count: response.data?.data?.count || 0,
      message: response.data?.message || "Categories fetched successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const createCategoryApi = async ({ token, payload }) => {
  try {
    const response = await categoryApi.post("/categories", payload, authConfig(token));

    return {
      category: response.data?.data?.category || null,
      message: response.data?.message || "Category created successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const updateCategoryApi = async ({ token, categoryId, payload }) => {
  try {
    const response = await categoryApi.put(`/categories/${categoryId}`, payload, authConfig(token));

    return {
      category: response.data?.data?.category || null,
      message: response.data?.message || "Category updated successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

const deleteCategoryApi = async ({ token, categoryId }) => {
  try {
    const response = await categoryApi.delete(`/categories/${categoryId}`, authConfig(token));

    return {
      message: response.data?.message || "Category deleted successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { createCategoryApi, deleteCategoryApi, getAllCategoriesApi, updateCategoryApi };
