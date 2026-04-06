import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderCard from "../components/orders/OrderCard";
import { useAuth } from "../context/AuthContext";
import { getMyOrdersApi } from "../services/orderService";

function MyOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setLoading(false);
        setError("Please login to view your orders.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await getMyOrdersApi(token);
        setOrders(result.orders || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">My Orders</h1>
      <p className="mt-2 text-sm text-slate-600">Track your order history and current delivery status.</p>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!error && orders.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">No orders yet</h2>
          <p className="mt-2 text-sm text-slate-600">You have not placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-5 inline-flex rounded-full bg-[#1f3b7a] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Start Shopping
          </Link>
        </div>
      ) : null}

      {!error && orders.length > 0 ? (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default MyOrders;
