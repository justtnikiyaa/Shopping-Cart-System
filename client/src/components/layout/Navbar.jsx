import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../utils/auth";

const linkClassName = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-200"
  }`;

function Navbar() {
  const navigate = useNavigate();
  const currentUser = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-lg font-bold text-emerald-700">
          ShopCart
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/products" className={linkClassName}>
            Products
          </NavLink>
          <NavLink to="/cart" className={linkClassName}>
            Cart
          </NavLink>

          {!currentUser ? (
            <>
              <NavLink to="/login" className={linkClassName}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClassName}>
                Register
              </NavLink>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
            >
              Logout
            </button>
          )}

          <NavLink to="/admin/dashboard" className={linkClassName}>
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
