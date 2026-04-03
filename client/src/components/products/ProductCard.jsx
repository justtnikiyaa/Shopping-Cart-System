import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

const trimText = (text, maxLength = 72) => {
  if (!text) {
    return "No description available.";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

function ProductCard({ product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          onError={(event) => {
            event.currentTarget.src = "https://placehold.co/600x400/e2e8f0/475569?text=ShopCart";
          }}
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1f3b7a]">
          {product.category?.name || "Uncategorized"}
        </span>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="text-lg font-semibold leading-tight text-slate-900">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{trimText(product.description)}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-bold text-[#1f3b7a]">{formatCurrency(product.price)}</p>
          <p className={`text-xs font-semibold ${isOutOfStock ? "text-red-600" : "text-emerald-600"}`}>
            {isOutOfStock ? "Out of stock" : `Stock: ${product.stock}`}
          </p>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#1f3b7a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#182f63]"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
