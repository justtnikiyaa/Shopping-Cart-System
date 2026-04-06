import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { getCategories, getProducts } from "../services/productService";

const PAGE_SIZE = 9;

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [apiError, setApiError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);

    try {
      const result = await getCategories();
      setCategories(result);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setApiError("");

    try {
      const result = await getProducts({
        search: searchQuery,
        category: selectedCategory,
        page,
        limit: PAGE_SIZE
      });

      setProducts(result.products);
      setPagination(result.pagination);
      setTotalProducts(result.total || 0);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    setPage(1);
    setSearchQuery(searchInput.trim());
  }, [searchInput]);

  const handleCategoryChange = useCallback((categoryId) => {
    setPage(1);
    setSelectedCategory(categoryId);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedCategory("");
    setPage(1);
  }, []);

  const handleRetry = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  const paginationNumbers = useMemo(() => {
    const totalPages = pagination.totalPages || 1;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    return [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [page, pagination.totalPages]);

  return (
    <section>
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#f8f9fd] to-[#eef3fb] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1f3b7a]">ShopCart Collections</p>
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
            onCategoryChange={handleCategoryChange}
            onClearFilters={handleClearFilters}
          />

          {loadingCategories ? <p className="mt-3 text-sm text-slate-500">Loading categories...</p> : null}
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-600">
              {loadingProducts ? "Loading products..." : `${totalProducts} product(s) found`}
            </p>
            {(searchQuery || selectedCategory) && !loadingProducts ? (
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1f3b7a]">Filtered results</p>
            ) : null}
          </div>

          {apiError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{apiError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700"
              >
                Retry
              </button>
            </div>
          ) : null}

          {loadingProducts ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              ))}
            </div>
          ) : null}

          {!loadingProducts && !apiError && products.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
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
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                {paginationNumbers.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      page === number
                        ? "bg-[#1f3b7a] text-white"
                        : "border border-slate-300 text-slate-700"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Products;
