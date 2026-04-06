import { useEffect, useMemo, useState } from "react";
import ProductForm from "../../components/admin/ProductForm";
import ProductTable from "../../components/admin/ProductTable";
import { useAuth } from "../../context/AuthContext";
import {
  createProductApi,
  deleteProductApi,
  getCategories,
  getProducts,
  updateProductApi
} from "../../services/productService";
import { uploadImageApi, validateImageFile } from "../../services/uploadService";
import { notifyError, notifySuccess } from "../../utils/toast";

const initialForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  stock: ""
};

function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const [formValues, setFormValues] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = async () => {
    setLoadingProducts(true);

    try {
      const result = await getProducts();
      setProducts(result.products || []);
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);

    try {
      const result = await getCategories();
      setCategories(result || []);
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    setErrorMessage("");
    loadProducts();
    loadCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase();

    return products.filter((product) => {
      const combined = `${product.name} ${product.description} ${product.category?.name || ""}`.toLowerCase();
      return combined.includes(term);
    });
  }, [products, searchTerm]);

  const validate = (values = formValues) => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!values.description.trim()) {
      errors.description = "Product description is required";
    }

    if (values.price === "" || Number(values.price) < 0) {
      errors.price = "Price must be a non-negative number";
    }

    if (!values.image.trim()) {
      errors.image = "Product image URL is required";
    }

    if (!values.category) {
      errors.category = "Category is required";
    }

    if (values.stock === "" || Number(values.stock) < 0) {
      errors.stock = "Stock must be a non-negative number";
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
    setEditingProductId("");
    setSelectedImageFile(null);
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormValues({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      image: product.image || "",
      category: product.category?._id || "",
      stock: product.stock?.toString() || ""
    });
    setSelectedImageFile(null);
    setFormErrors({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    handleResetForm();
  };

  const handleDelete = async (product) => {
    if (!token) {
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    const confirmed = window.confirm(`Delete product "${product.name}"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product._id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await deleteProductApi({ token, productId: product._id });
      setSuccessMessage(result.message);
      notifySuccess(result.message || "Product deleted successfully.");

      if (editingProductId === product._id) {
        handleResetForm();
      }

      await loadProducts();
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to delete product.");
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
        price: Number(nextValues.price),
        image: nextValues.image.trim(),
        category: nextValues.category,
        stock: Number(nextValues.stock)
      };

      if (editingProductId) {
        const result = await updateProductApi({ token, productId: editingProductId, payload });
        setSuccessMessage(result.message);
        notifySuccess(result.message || "Product updated successfully.");
      } else {
        const result = await createProductApi({ token, payload });
        setSuccessMessage(result.message);
        notifySuccess(result.message || "Product created successfully.");
      }

      handleResetForm();
      await loadProducts();
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Product Inventory</h1>
          <p className="mt-2 text-sm text-slate-600">Manage and monitor your ShopCart collection.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Items</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Low Stock</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{products.filter((p) => Number(p.stock) <= 5).length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Active Categories</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{categories.length}</p>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <ProductForm
          mode={editingProductId ? "edit" : "create"}
          values={formValues}
          errors={formErrors}
          categories={categories}
          loading={submitting || loadingCategories}
          uploadingImage={uploadingImage}
          selectedImageName={selectedImageFile?.name || ""}
          onChange={handleInputChange}
          onImageFileChange={handleImageFileChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          onReset={handleResetForm}
        />

        <div>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search product name, description, or category..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            />
          </div>

          <ProductTable
            products={filteredProducts}
            loading={loadingProducts}
            deletingId={deletingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;
