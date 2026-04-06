import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const uploadApi = axios.create({
  baseURL: API_BASE_URL
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif"
];

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data"
  }
});

const mapApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return "Image upload failed. Please try again.";
};

const validateImageFile = (file) => {
  if (!file) {
    throw new Error("Please select an image file");
  }

  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP, GIF, or AVIF images are allowed");
  }
};

const uploadImageApi = async ({ token, file }) => {
  validateImageFile(file);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await uploadApi.post("/upload", formData, authConfig(token));

    return {
      url: response.data?.data?.url || "",
      publicId: response.data?.data?.publicId || "",
      message: response.data?.message || "Image uploaded successfully"
    };
  } catch (error) {
    throw new Error(mapApiError(error));
  }
};

export { uploadImageApi, validateImageFile };
