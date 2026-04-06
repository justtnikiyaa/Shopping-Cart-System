const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700"
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

function OrderTable({
  orders,
  loading,
  updatingOrderId,
  onStatusChange
}) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-20 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-900">No orders available</p>
        <p className="mt-2 text-sm text-slate-600">Orders will appear here when customers checkout.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <th className="px-3 py-3">Order ID</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Total</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">#{order._id.slice(-8)}</td>
                <td className="px-3 py-3">
                  <p className="text-sm font-semibold text-slate-900">{order.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{order.items?.length || 0} item(s)</p>
                </td>
                <td className="px-3 py-3 text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                <td className="px-3 py-3">
                  <span className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClassMap[order.status] || "bg-slate-100 text-slate-700"}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(event) => onStatusChange(order, event.target.value)}
                    disabled={updatingOrderId === order._id}
                    className="mt-2 block rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none"
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                  </select>
                </td>
                <td className="px-3 py-3 text-sm text-slate-600">{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;
