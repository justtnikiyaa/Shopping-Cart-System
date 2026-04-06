import LoadingSpinner from "../common/LoadingSpinner";

function ProductForm({
  mode,
  values,
  errors,
  categories,
  loading,
  onChange,
  onSubmit,
  onCancel,
  onReset
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {mode === "edit" ? "Edit Product" : "Add New Product"}
      </h2>

      <form className="mt-5 space-y-4" onSubmit={onSubmit} noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="Product name"
          />
          {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={values.description}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="Short product description"
          />
          {errors.description ? <p className="mt-1 text-sm text-red-600">{errors.description}</p> : null}
        </div>

        <div>
          <label htmlFor="image" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            value={values.image}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="https://example.com/product.jpg"
          />
          {errors.image ? <p className="mt-1 text-sm text-red-600">{errors.image}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
              placeholder="0.00"
            />
            {errors.price ? <p className="mt-1 text-sm text-red-600">{errors.price}</p> : null}
          </div>

          <div>
            <label htmlFor="stock" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
              placeholder="0"
            />
            {errors.stock ? <p className="mt-1 text-sm text-red-600">{errors.stock}</p> : null}
          </div>
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category ? <p className="mt-1 text-sm text-red-600">{errors.category}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1f3b7a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#182f63] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : mode === "edit" ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </button>

          <button
            type="button"
            onClick={mode === "edit" ? onCancel : onReset}
            disabled={loading}
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
          >
            {mode === "edit" ? "Cancel Edit" : "Reset"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
