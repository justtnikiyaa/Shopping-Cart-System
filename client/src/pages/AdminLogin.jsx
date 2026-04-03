import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { logout, saveAuthData } from "../utils/auth";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Admin email is required";
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

      if (result.user.role !== "admin") {
        logout();
        setApiError("Access denied: admin credentials are required");
        return;
      }

      saveAuthData({ token: result.token, user: result.user });
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f2f8] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(35,56,112,0.08),_transparent_45%)]" />

      <main className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f3b7a] text-white shadow-md">
            ⚿
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-[#1d2f6f]">ShopCart</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Internal Systems</p>
        </div>

        <div className="rounded-[30px] bg-white px-8 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Secure Admin Access</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to manage the atelier ecosystem.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Admin ID / Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-[#f3f3f8] px-4 py-3 text-slate-900 outline-none ring-[#1f3b7a] focus:ring"
                placeholder="admin.name@ShopCart.com"
              />
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Password
                </label>
                <button type="button" className="text-xs font-semibold uppercase tracking-[0.08em] text-[#1f3b7a]">
                  Reset Access
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
              {loading ? "Authorizing..." : "Authorize Access"}
            </button>
          </form>

          <div className="mt-7 border-t border-slate-200 pt-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            2FA Active  •  Global Node
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Not an admin?{" "}
          <Link to="/login" className="font-semibold text-[#1f3b7a] hover:underline">
            Go to user login
          </Link>
        </p>
      </main>
    </div>
  );
}

export default AdminLogin;
