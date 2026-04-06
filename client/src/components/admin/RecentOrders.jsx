import { Link } from "react-router-dom";

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

function RecentOrders({ orders, loading }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Recent Orders</h2>
        <Link to="/admin/orders" className="text-sm font-semibold text-[#1f3b7a] hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ) : null}

      {!loading && orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          No recent orders found.
        </div>
      ) : null}

      {!loading && orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-2 py-3">Order ID</th>
                <th className="px-2 py-3">Customer</th>
                <th className="px-2 py-3">Status</th>
                <th className="px-2 py-3">Date</th>
                <th className="px-2 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b border-slate-100 last:border-0">
                  <td className="px-2 py-3 text-sm font-semibold text-slate-900">#{order._id.slice(-8)}</td>
                  <td className="px-2 py-3 text-sm text-slate-700">{order.user?.name || "Unknown"}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusClassMap[order.status] || "bg-slate-100 text-slate-700"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm text-slate-600">{formatDate(order.createdAt)}</td>
                  <td className="px-2 py-3 text-sm font-semibold text-slate-900">{formatCurrency(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default RecentOrders;
