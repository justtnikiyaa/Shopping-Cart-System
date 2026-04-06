import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function OrderSummary({ items, subtotal, tax, total }) {
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Order Summary</h2>

      <div className="mt-5 space-y-4">
        {items.slice(0, 3).map((item) => (
          <div key={item.product?._id} className="flex items-center gap-3">
            <img
              src={item.product?.image || "https://placehold.co/160x160/e2e8f0/475569?text=ShopCart"}
              alt={item.product?.name || "Product"}
              className="h-14 w-14 rounded-xl object-cover"
              onError={(event) => {
                event.currentTarget.src = "https://placehold.co/160x160/e2e8f0/475569?text=ShopCart";
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{item.product?.name}</p>
              <p className="text-xs text-slate-500">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.subtotal)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-semibold">Included</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Estimated Tax</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-lg font-semibold text-slate-900">Total</span>
        <span className="text-3xl font-bold text-[#1f3b7a]">{formatCurrency(total)}</span>
      </div>

      <Link
        to="/cart"
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
      >
        Back to Cart
      </Link>
    </aside>
  );
}

export default OrderSummary;
