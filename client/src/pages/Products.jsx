import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { getCategories, getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const result = await getCategories();
        setCategories(result);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setApiError("");

      try {
        const result = await getProducts({
          search: searchQuery,
          category: selectedCategory
        });

        setProducts(result.products);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedCategory("");
  };

  return (
    <section>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#f8f9fd] to-[#eef3fb] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f3b7a]">ShopCartt Collections</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Product Listing</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          Explore curated products, discover categories, and find what you need quickly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <ProductFilters
            searchInput={searchInput}
            selectedCategory={selectedCategory}
            categories={categories}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={handleSearchSubmit}
            onCategoryChange={setSelectedCategory}
            onClearFilters={handleClearFilters}
          />

          {loadingCategories ? <p className="mt-3 text-sm text-slate-500">Loading categories...</p> : null}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-600">
              {loadingProducts ? "Loading products..." : `${products.length} product(s) found`}
            </p>
            {(searchQuery || selectedCategory) && !loadingProducts ? (
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1f3b7a]">Filtered results</p>
            ) : null}
          </div>

          {apiError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{apiError}</div>
          ) : null}

          {loadingProducts ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : null}

          {!loadingProducts && !apiError && products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">No products found</p>
              <p className="mt-2 text-sm text-slate-600">
                Try changing your search or category filter to see more products.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 rounded-xl bg-[#1f3b7a] px-4 py-2 text-sm font-semibold text-white"
              >
                Reset Filters
              </button>
            </div>
          ) : null}

          {!loadingProducts && !apiError && products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Products;
