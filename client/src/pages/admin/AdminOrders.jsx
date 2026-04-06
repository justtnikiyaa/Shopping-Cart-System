import { useEffect, useMemo, useState } from "react";
import OrderTable from "../../components/admin/OrderTable";
import { useAuth } from "../../context/AuthContext";
import { getAllOrdersApi, updateOrderStatusApi } from "../../services/orderService";
import { notifyError, notifySuccess } from "../../utils/toast";

const allowedStatuses = ["pending", "processing", "shipped", "delivered"];

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadOrders = async () => {
    if (!token) {
      setLoading(false);
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await getAllOrdersApi(token);
      setOrders(result.orders || []);
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );

  const handleStatusChange = async (order, nextStatus) => {
    if (!token) {
      const message = "Admin token not found. Please login again.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    if (!allowedStatuses.includes(nextStatus)) {
      const message = "Invalid status selected.";
      setErrorMessage(message);
      notifyError(message);
      return;
    }

    if (order.status === nextStatus) {
      return;
    }

    setUpdatingOrderId(order._id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const result = await updateOrderStatusApi({
        token,
        orderId: order._id,
        status: nextStatus
      });

      setSuccessMessage(result.message);
      notifySuccess(result.message || "Order status updated successfully.");

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                status: nextStatus
              }
            : item
        )
      );
    } catch (error) {
      setErrorMessage(error.message);
      notifyError(error.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Orders Management</h1>
          <p className="mt-2 text-sm text-slate-600">Monitor all customer orders and update delivery status.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Orders</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Orders Pending</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Delivered</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {orders.filter((order) => order.status === "delivered").length}
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <div className="mt-6">
        <OrderTable
          orders={orders}
          loading={loading}
          updatingOrderId={updatingOrderId}
          onStatusChange={handleStatusChange}
        />
      </div>
    </section>
  );
}

export default AdminOrders;
