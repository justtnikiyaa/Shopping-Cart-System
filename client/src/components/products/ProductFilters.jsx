function ProductFilters({
  searchInput,
  selectedCategory,
  categories,
  onSearchInputChange,
  onSearchSubmit,
  onCategoryChange,
  onClearFilters
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Search</h2>

      <form onSubmit={onSearchSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by product name"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none ring-[#1f3b7a] focus:ring"
        />
        <button type="submit" className="rounded-xl bg-[#1f3b7a] px-4 py-2 text-sm font-semibold text-white">
          Go
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Categories</h3>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
              selectedCategory === "" ? "bg-[#1f3b7a] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => onCategoryChange(category._id)}
              className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                selectedCategory === category._id
                  ? "bg-[#1f3b7a] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        className="mt-6 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Clear Filters
      </button>
    </aside>
  );
}

export default ProductFilters;
