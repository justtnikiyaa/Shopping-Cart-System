import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function CartItem({ item, onIncrease, onDecrease, onRemove, disabled }) {
  const product = item.product || {};
  const stock = Number(product.stock || 0);
  const canIncrease = item.quantity < stock;
  const canDecrease = item.quantity > 1;

  return (
    <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <img
        src={product.image || "https://placehold.co/240x240/e2e8f0/475569?text=ShopCart"}
        alt={product.name || "Product"}
        className="h-24 w-24 rounded-xl object-cover"
        onError={(event) => {
          event.currentTarget.src = "https://placehold.co/240x240/e2e8f0/475569?text=ShopCart";
        }}
      />

      <div>
        <Link to={`/products/${product._id}`} className="text-lg font-semibold text-slate-900 hover:text-[#1f3b7a]">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-slate-500">{formatCurrency(product.price)} each</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
        >
          Remove item
        </button>
      </div>

      <div className="sm:text-right">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 p-1">
          <button
            type="button"
            onClick={onDecrease}
            disabled={disabled || !canDecrease}
            className="h-8 w-8 rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            -
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            disabled={disabled || !canIncrease}
            className="h-8 w-8 rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            +
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">Stock: {stock}</p>
        <p className="mt-1 text-lg font-bold text-[#1f3b7a]">{formatCurrency(item.subtotal)}</p>
      </div>
    </article>
  );
}

export default CartItem;
