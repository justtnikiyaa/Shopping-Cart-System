import { useState } from "react";

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

const statusClassMap = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700"
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Order ID</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">#{order._id}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span>{formatDate(order.createdAt)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-400" />
          <span>{order.items?.length || 0} item(s)</span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClassMap[order.status] || "bg-slate-100 text-slate-700"}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-600">Total Amount</p>
        <p className="text-xl font-bold text-[#1f3b7a]">{formatCurrency(order.total)}</p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
      >
        {expanded ? "Hide Details" : "View Details"}
      </button>

      {expanded ? (
        <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
          {(order.items || []).map((item) => (
            <div key={`${order._id}-${item.product?._id || item.name}`} className="flex items-center gap-3">
              <img
                src={item.image || item.product?.image || "https://placehold.co/120x120/e2e8f0/475569?text=ShopCart"}
                alt={item.name}
                className="h-12 w-12 rounded-lg object-cover"
                onError={(event) => {
                  event.currentTarget.src = "https://placehold.co/120x120/e2e8f0/475569?text=ShopCart";
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default OrderCard;
