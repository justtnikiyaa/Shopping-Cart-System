import { useEffect, useState } from "react";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryTable from "../../components/admin/CategoryTable";
import { useAuth } from "../../context/AuthContext";
import {
  createCategoryApi,
  deleteCategoryApi,
  getAllCategoriesApi,
  updateCategoryApi
} from "../../services/categoryService";
import { uploadImageApi, validateImageFile } from "../../services/uploadService";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialForm = {
  name: "",
  description: "",
  image: ""
};

function AdminCategories() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [formValues, setFormValues] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const result = await getAllCategoriesApi();
      setCategories(result.categories || []);
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const validate = (values = formValues) => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = "Category name is required";
    }

    if (!values.description.trim()) {
      errors.description = "Category description is required";
    }

    if (!values.image.trim()) {
      errors.image = "Category image URL is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedImageFile(null);
      return;
    }

    try {
      validateImageFile(file);
      setSelectedImageFile(file);
      setErrorMessage("");
      setSuccessMessage("");
    } catch (error) {
      setSelectedImageFile(null);
      setErrorMessage(error.message);
      notifyError(error.message);
    }
  };

  const handleImageUpload = async () => {
    if (!token) {
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return null;
    }

    if (!selectedImageFile) {
      const message = "Please choose an image file before uploading.";
      setErrorMessage(message);
      notifyError(message);
      return null;
    }

    setUploadingImage(true);
    setErrorMessage("");

    try {
      const result = await uploadImageApi({ token, file: selectedImageFile });

      setFormValues((prev) => ({ ...prev, image: result.url }));
      setFormErrors((prev) => ({ ...prev, image: "" }));
      setSuccessMessage(result.message);
      notifySuccess(result.message || "Image uploaded successfully.");
      return result.url;
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to upload image.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResetForm = () => {
    setFormValues(initialForm);
    setFormErrors({});
    setEditingCategoryId("");
    setSelectedImageFile(null);
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category._id);
    setFormValues({
      name: category.name || "",
      description: category.description || "",
      image: category.image || ""
    });
    setSelectedImageFile(null);
    setFormErrors({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    handleResetForm();
  };

  const handleDelete = async (category) => {
    if (!token) {
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    const confirmed = window.confirm(`Delete category "${category.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(category._id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await deleteCategoryApi({ token, categoryId: category._id });
      setSuccessMessage(result.message);
      notifySuccess(result.message || "Category deleted successfully.");

      if (editingCategoryId === category._id) {
        handleResetForm();
      }

      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to delete category.");
    } finally {
      setDeletingId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    let finalImageUrl = formValues.image.trim();

    if (selectedImageFile) {
      const uploadedImageUrl = await handleImageUpload();

      if (!uploadedImageUrl) {
        return;
      }

      finalImageUrl = uploadedImageUrl;
    }

    const nextValues = { ...formValues, image: finalImageUrl };
    setFormValues(nextValues);

    if (!validate(nextValues)) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        name: nextValues.name.trim(),
        description: nextValues.description.trim(),
        image: nextValues.image.trim()
      };

      if (editingCategoryId) {
        const result = await updateCategoryApi({ token, categoryId: editingCategoryId, payload });
        setSuccessMessage(result.message);
        notifySuccess(result.message || "Category updated successfully.");
      } else {
        const result = await createCategoryApi({ token, payload });
        setSuccessMessage(result.message);
        notifySuccess(result.message || "Category created successfully.");
      }

      handleResetForm();
      await loadCategories();
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to save category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Admin Categories</h1>
      <p className="mt-2 text-sm text-slate-600">Create, update, and remove product categories.</p>

      {errorMessage ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
        <CategoryForm
          mode={editingCategoryId ? "edit" : "create"}
          values={formValues}
          errors={formErrors}
          loading={submitting}
          uploadingImage={uploadingImage}
          selectedImageName={selectedImageFile?.name || ""}
          onChange={handleInputChange}
          onImageFileChange={handleImageFileChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          onReset={handleResetForm}
        />

        <CategoryTable
          categories={categories}
          loading={loading}
          deletingId={deletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </section>
  );
}

export default AdminCategories;
