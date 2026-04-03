import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[#eef2f8]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-2xl font-semibold text-[#1f3b7a]">
            ShopCart
          </Link>
          <p className="mt-3 leading-6">Premium online shopping experience with curated categories, secure checkout, and fast delivery.</p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Shop</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/" className="hover:text-[#1f3b7a]">Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#1f3b7a]">Products</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#1f3b7a]">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Support</h3>
          <ul className="mt-3 space-y-2">
            <li>Shipping & Returns</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Newsletter</h3>
          <p className="mt-3">Get updates on new arrivals and special offers.</p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-l-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1f3b7a]"
            />
            <button type="button" className="rounded-r-xl bg-[#1f3b7a] px-4 font-semibold text-white">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopCart. All rights reserved.</p>
          <p>Built for modern e-commerce.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
