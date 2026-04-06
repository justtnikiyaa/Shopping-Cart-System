const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function ProductTable({ products, loading, deletingId, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No products available</p>
        <p className="mt-2 text-sm text-slate-600">Create your first product using the form.</p>
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
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3">
                  <img
                    src={product.image || "https://placehold.co/120x120/e2e8f0/475569?text=Product"}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.src = "https://placehold.co/120x120/e2e8f0/475569?text=Product";
                    }}
                  />
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">{product.name}</td>
                <td className="px-3 py-3 text-sm text-slate-600">{product.category?.name || "N/A"}</td>
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">{formatCurrency(product.price)}</td>
                <td className="px-3 py-3 text-sm text-slate-700">{product.stock}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      disabled={deletingId === product._id}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
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

export default ProductTable;
