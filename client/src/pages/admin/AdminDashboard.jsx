import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/admin/DashboardCard";
import RecentOrders from "../../components/admin/RecentOrders";
import { useAuth } from "../../context/AuthContext";
import { getCategories, getProducts } from "../../services/productService";
import { getAllOrdersApi } from "../../services/orderService";

function AdminDashboard() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        setLoading(false);
        setError("Admin token not found. Please login again.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [productResult, categoryResult, orderResult] = await Promise.all([
          getProducts(),
          getCategories(),
          getAllOrdersApi(token)
        ]);

        setProducts(productResult.products || []);
        setCategories(categoryResult || []);
        setOrders(orderResult.orders || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );

  const totalSales = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders]
  );

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Simple overview of ShopCart operations and order activity.</p>
        </div>
        <div className="text-sm text-slate-500">{new Date().toLocaleDateString()}</div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={loading ? "..." : products.length}
          hint="Catalog entries currently active"
        />
        <DashboardCard
          title="Total Categories"
          value={loading ? "..." : categories.length}
          hint="Product categories in use"
        />
        <DashboardCard
          title="Total Orders"
          value={loading ? "..." : orders.length}
          hint="All customer orders"
        />
        <DashboardCard
          title="Total Users"
          value="N/A"
          hint="Not available from current API"
          accent="text-slate-500"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <RecentOrders orders={orders} loading={loading} />

        <aside className="space-y-4">
          <div className="rounded-3xl bg-[#1f3b7a] p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/80">System Snapshot</p>
            <p className="mt-3 text-3xl font-bold">{loading ? "..." : pendingOrders}</p>
            <p className="mt-1 text-sm text-white/80">Orders pending action</p>
            <p className="mt-4 text-sm text-white/90">
              Total Sales: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSales)}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Quick Links</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/admin/products"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Manage Products
              </Link>
              <Link
                to="/admin/categories"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Manage Categories
              </Link>
              <Link
                to="/admin/orders"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Manage Orders
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default AdminDashboard;
