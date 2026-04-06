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

  const validate = () => {
    const errors = {};

    if (!formValues.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formValues.description.trim()) {
      errors.description = "Product description is required";
    }

    if (formValues.price === "" || Number(formValues.price) < 0) {
      errors.price = "Price must be a non-negative number";
    }

    if (!formValues.image.trim()) {
      errors.image = "Product image URL is required";
    }

    if (!formValues.category) {
      errors.category = "Category is required";
    }

    if (formValues.stock === "" || Number(formValues.stock) < 0) {
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

  const handleResetForm = () => {
    setFormValues(initialForm);
    setFormErrors({});
    setEditingProductId("");
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
    setFormErrors({});
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    handleResetForm();
  };

  const handleDelete = async (product) => {
    if (!token) {
      setErrorMessage("Admin token not found. Please login again.");
      return;
    }

    const confirmed = window.confirm(`Delete product \"${product.name}\"?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product._id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await deleteProductApi({ token, productId: product._id });
      setSuccessMessage(result.message);

      if (editingProductId === product._id) {
        handleResetForm();
      }

      await loadProducts();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeletingId("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!token) {
      setErrorMessage("Admin token not found. Please login again.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        name: formValues.name.trim(),
        description: formValues.description.trim(),
        price: Number(formValues.price),
        image: formValues.image.trim(),
        category: formValues.category,
        stock: Number(formValues.stock)
      };

      if (editingProductId) {
        const result = await updateProductApi({ token, productId: editingProductId, payload });
        setSuccessMessage(result.message);
      } else {
        const result = await createProductApi({ token, payload });
        setSuccessMessage(result.message);
      }

      handleResetForm();
      await loadProducts();
    } catch (error) {
      setErrorMessage(error.message);
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
          onChange={handleInputChange}
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
