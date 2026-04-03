import { Link } from "react-router-dom";

function FeaturedCategories({ categories, loading }) {
  return (
    <section className="mt-16">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Curated Categories</h2>
          <p className="text-sm text-slate-500">The spirit of a refined lifestyle.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : null}

      {!loading && categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No categories available yet.
        </div>
      ) : null}

      {!loading && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category._id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
            >
              <img
                src={category.image || "https://placehold.co/700x420/e2e8f0/334155?text=Category"}
                alt={category.name}
                className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = "https://placehold.co/700x420/e2e8f0/334155?text=Category";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-lg font-semibold">{category.name}</p>
                <p className="text-xs text-white/80">View products</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default FeaturedCategories;
