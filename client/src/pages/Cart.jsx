import { useMemo } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import { useCart } from "../context/CartContext";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function Cart() {
  const {
    items,
    totalAmount,
    totalItems,
    isCartLoading,
    isCartMutating,
    updateQuantity,
    removeFromCart,
    clearCart,
    clearMessages
  } = useCart();

  const estimatedTax = useMemo(() => Number((totalAmount * 0.08).toFixed(2)), [totalAmount]);
  const grandTotal = useMemo(() => Number((totalAmount + estimatedTax).toFixed(2)), [totalAmount, estimatedTax]);

  const handleIncrease = async (item) => {
    clearMessages();

    try {
      await updateQuantity({ productId: item.product._id, quantity: item.quantity + 1 });
    } catch {
      // Errors are handled in CartContext with toasts.
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    clearMessages();

    try {
      await updateQuantity({ productId: item.product._id, quantity: item.quantity - 1 });
    } catch {
      // Errors are handled in CartContext with toasts.
    }
  };

  const handleRemove = async (item) => {
    clearMessages();

    try {
      await removeFromCart(item.product._id);
    } catch {
      // Errors are handled in CartContext with toasts.
    }
  };

  const handleClearCart = async () => {
    clearMessages();

    try {
      await clearCart();
    } catch {
      // Errors are handled in CartContext with toasts.
    }
  };

  if (isCartLoading) {
    return (
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
          Add products to your cart to start building your order.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex rounded-full bg-[#1f3b7a] px-6 py-3 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-5xl font-semibold tracking-tight text-slate-900">Your Atelier Selection</h1>
      <p className="mt-2 text-sm text-slate-600">
        Review your chosen pieces before they are meticulously prepared for delivery.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Products ({totalItems})</p>
            <button
              type="button"
              onClick={handleClearCart}
              disabled={isCartMutating}
              className="text-sm font-semibold text-red-600 disabled:opacity-60"
            >
              Clear Cart
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product?._id}
                item={item}
                onIncrease={() => handleIncrease(item)}
                onDecrease={() => handleDecrease(item)}
                onRemove={() => handleRemove(item)}
                disabled={isCartMutating}
              />
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Order Summary</h2>

          <div className="mt-6 space-y-4 border-b border-slate-200 pb-5 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>White Glove Shipping</span>
              <span className="font-semibold">Included</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated Tax</span>
              <span className="font-semibold">{formatCurrency(estimatedTax)}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-lg font-semibold text-slate-900">Total</span>
            <span className="text-3xl font-bold text-[#1f3b7a]">{formatCurrency(grandTotal)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#1f3b7a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#182f63]"
          >
            Proceed to Checkout
          </Link>

          <Link
            to="/products"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Continue Browsing
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
