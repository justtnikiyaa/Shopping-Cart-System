import { Link } from "react-router-dom";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function FeaturedProducts({ products, loading }) {
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Trending Pieces</h2>
          <p className="text-sm text-slate-500">The most admired picks of the season.</p>
        </div>
        <Link to="/products" className="rounded-full bg-[#1f3b7a] px-4 py-2 text-xs font-semibold text-white">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : null}

      {!loading && products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No featured products right now.
        </div>
      ) : null}

      {!loading && products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <article key={product._id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "https://placehold.co/500x500/e2e8f0/475569?text=ShopCart";
                  }}
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{product.name}</h3>
              <p className="mt-1 text-xs font-medium text-[#1f3b7a]">{formatCurrency(product.price)}</p>
              <Link
                to={`/products/${product._id}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-[#1f3b7a] px-3 py-2 text-xs font-semibold text-white"
              >
                View Product
              </Link>
            </article>
          ))}
        </div>
      ) : null}

      <div className="mt-12 rounded-3xl bg-[#304a87] px-6 py-10 text-center text-white sm:px-10">
        <h3 className="text-3xl font-semibold tracking-tight">Join the Inner Circle</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">
          Receive private access to new collection launches, artisan stories, and exclusive atelier events.
        </p>
        <div className="mx-auto mt-5 flex w-full max-w-md items-center overflow-hidden rounded-full bg-white/20 p-1">
          <input
            type="email"
            placeholder="atelier@you.com"
            className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/70 outline-none"
          />
          <button type="button" className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-[#1f3b7a]">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
