import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { saveAuthData } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const fromPath = location.state?.from?.pathname;

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await loginUser({
        email: form.email.trim(),
        password: form.password
      });

      saveAuthData({ token: result.token, user: result.user });

      const redirectPath = result.user.role === "admin" ? "/admin/dashboard" : fromPath || "/";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-3xl font-semibold tracking-tight text-[#1d2f6f]">
            ShopCart
          </Link>
          <nav className="hidden gap-8 text-sm text-slate-500 md:flex">
            <span>New Arrivals</span>
            <span>Collections</span>
            <span>Atelier</span>
            <span>Journal</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-[28px] bg-white px-8 py-9 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <h1 className="text-center text-5xl font-semibold tracking-tight text-slate-900">Welcome Back</h1>
          <p className="mt-3 text-center text-base text-slate-500">Access your personalized atelier experience</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                placeholder="name@domain.com"
              />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </label>
                <button type="button" className="text-xs font-semibold text-[#1f3b7a]">
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                placeholder="Enter password"
              />
              {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
            </div>

            {apiError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-[#1f3b7a] px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#182f63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In to Atelier"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            New to ShopCart?{" "}
            <Link to="/register" className="font-semibold text-[#1f3b7a] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-[#e9edf5]">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-sm text-slate-500 md:grid-cols-4">
          <div>
            <p className="text-2xl font-semibold text-[#1d2f6f]">ShopCart</p>
            <p className="mt-3">Crafting digital elegance for the modern connoisseur.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            <p className="mt-3">New Arrivals</p>
            <p>Collections</p>
            <p>Sustainability</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Legal</p>
            <p className="mt-3">Privacy Policy</p>
            <p>Terms of Service</p>
            <p>Shipping & Returns</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Journal</p>
            <p className="mt-3">Subscribe for early access.</p>
            <div className="mt-3 flex">
              <input className="w-full rounded-l-lg border border-slate-300 px-3 py-2 text-xs" placeholder="Email Address" />
              <button className="rounded-r-lg bg-[#1f3b7a] px-4 text-white">→</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
