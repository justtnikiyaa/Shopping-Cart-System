function CategoryTable({ categories, loading, deletingId, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No categories available</p>
        <p className="mt-2 text-sm text-slate-600">Create your first category using the form.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <th className="px-3 py-3">Image</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3">
                  <img
                    src={category.image || "https://placehold.co/120x120/e2e8f0/475569?text=Category"}
                    alt={category.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "https://placehold.co/120x120/e2e8f0/475569?text=Category";
                    }}
                  />
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">{category.name}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{category.description}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      disabled={deletingId === category._id}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {deletingId === category._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoryTable;
