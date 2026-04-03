import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "text-[#1f3b7a]" : "text-slate-600 hover:text-[#1f3b7a]"
  }`;

const getStoredCartCount = () => {
  try {
    const raw = localStorage.getItem("cart");

    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed?.items)) {
      return 0;
    }

    return parsed.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  } catch {
    return 0;
  }
};

function Navbar() {
  const navigate = useNavigate();
  const { user, isAdminUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getStoredCartCount());

    const handleStorage = () => {
      setCartCount(getStoredCartCount());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const firstName = useMemo(() => {
    if (!user?.name) {
      return "";
    }

    return user.name.split(" ")[0];
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-[#1f3b7a]">
          ShopCart
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/cart" className="relative rounded-md p-2 text-slate-600 transition hover:bg-slate-100 hover:text-[#1f3b7a]" aria-label="Cart">
            <span className="text-lg">🛒</span>
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1f3b7a] px-1 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className="rounded-full bg-[#1f3b7a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#182f63]">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="px-2 text-sm font-medium text-slate-700">Hi, {firstName || "User"}</span>

              {isAdminUser ? (
                <NavLink to="/admin/dashboard" className="rounded-full border border-[#1f3b7a]/20 px-4 py-2 text-sm font-semibold text-[#1f3b7a] transition hover:bg-[#1f3b7a] hover:text-white">
                  Admin Dashboard
                </NavLink>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="rounded-md border border-slate-300 p-2 text-slate-600 md:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {isMobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" onClick={closeMobileMenu} className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" onClick={closeMobileMenu} className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/cart" onClick={closeMobileMenu} className={navLinkClass}>
              Cart ({cartCount})
            </NavLink>

            {!user ? (
              <>
                <NavLink to="/login" onClick={closeMobileMenu} className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="mt-2 rounded-xl bg-[#1f3b7a] px-4 py-2 text-center text-sm font-semibold text-white"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <p className="px-3 py-2 text-sm font-medium text-slate-700">Signed in as {firstName || "User"}</p>

                {isAdminUser ? (
                  <NavLink
                    to="/admin/dashboard"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2 text-sm font-medium text-[#1f3b7a] hover:bg-slate-100"
                  >
                    Admin Dashboard
                  </NavLink>
                ) : null}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
