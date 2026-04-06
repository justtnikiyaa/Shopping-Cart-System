import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { notifyError, notifySuccess } from "../utils/toast";

function Register() {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    }

    if (!form.password) {
      nextErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    } else {
      const hasLetter = /[A-Za-z]/.test(form.password);
      const hasNumber = /\d/.test(form.password);

      if (!hasLetter || !hasNumber) {
        nextErrors.password = "Password must contain at least one letter and one number";
      }
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
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
      await registerAccount({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });

      notifySuccess("Registration successful. Welcome to ShopCart!");
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(error.message);
      notifyError(error.message || "Registration failed.");
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
        <div className="mx-auto w-full max-w-xl rounded-[30px] bg-white px-8 py-9 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <h1 className="text-center text-5xl font-semibold tracking-tight text-slate-900">Join the Atelier</h1>
          <p className="mt-3 text-center text-base text-slate-500">
            Experience the art of curated luxury. Create your account to begin your bespoke journey.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                placeholder="Elias Thorne"
              />
              {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
            </div>

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
                placeholder="elias@atelier.com"
              />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                  placeholder="Minimum 8 characters, with letters and numbers"
                />
                {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password}</p> : null}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword ? (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                ) : null}
              </div>
            </div>

            {apiError ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</p> : null}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f3b7a] px-4 py-3 text-base font-semibold text-white shadow-md transition hover:bg-[#182f63] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#1f3b7a] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-[#e9edf5]">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 text-sm text-slate-500 md:grid-cols-4">
          <div>
            <p className="text-2xl font-semibold text-[#1d2f6f]">ShopCart</p>
            <p className="mt-3">The digital destination for modern craft and intentional design.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Essentials</p>
            <p className="mt-3">Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Support</p>
            <p className="mt-3">Shipping & Returns</p>
            <p>Sustainability</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contact</p>
            <p className="mt-3">hello@shopcart.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;


