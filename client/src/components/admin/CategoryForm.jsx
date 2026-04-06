import LoadingSpinner from "../common/LoadingSpinner";

const defaultValues = {
  name: "",
  description: "",
  image: ""
};

function CategoryForm({
  mode,
  values,
  errors,
  loading,
  onChange,
  onSubmit,
  onCancel,
  onReset
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {mode === "edit" ? "Edit Category" : "Add Category"}
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
            placeholder="Example: Fashion"
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
            value={values.description}
            onChange={onChange}
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-[#1f3b7a] focus:ring"
            placeholder="Short category description"
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
            placeholder="https://example.com/category.jpg"
          />
          {errors.image ? <p className="mt-1 text-sm text-red-600">{errors.image}</p> : null}
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
              "Update Category"
            ) : (
              "Create Category"
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

      <input type="hidden" value={JSON.stringify(defaultValues)} readOnly />
    </section>
  );
}

export default CategoryForm;
