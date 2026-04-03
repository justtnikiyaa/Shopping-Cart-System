import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

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
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
