import { Link } from "react-router-dom";

function HeroSection({ featuredProduct }) {
  return (
    <section className="grid gap-6 rounded-[30px] bg-gradient-to-r from-[#f7f8fd] to-[#eef2fb] p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f3b7a]">ShopCart Atelier</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Crafting <span className="text-[#1f3b7a]">Modernity.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          A curated selection of minimalist electronics, high-end fashion, and sculptural home goods
          designed for the discerning individual.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-full bg-[#1f3b7a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#182f63]"
          >
            Shop Now
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Products
          </Link>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-sm">
        <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-[0_30px_70px_rgba(15,23,42,0.25)]">
          <img
            src={featuredProduct?.image || "https://placehold.co/700x900/0f172a/e2e8f0?text=ShopCart"}
            alt={featuredProduct?.name || "Featured collection"}
            className="h-[420px] w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "https://placehold.co/700x900/0f172a/e2e8f0?text=ShopCart";
            }}
          />
        </div>

        <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">New Collection</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{featuredProduct?.name || "Signature Essentials"}</p>
          <p className="text-xs text-slate-500">Sculpted elegance in everyday form</p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
