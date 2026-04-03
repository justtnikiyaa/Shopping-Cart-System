import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const { pathname } = useLocation();
  const authLikeRoute = pathname === "/login" || pathname === "/register" || pathname === "/admin/login";

  if (authLikeRoute) {
    return (
      <div className="min-h-screen bg-[#f2f2f8] text-slate-900">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
