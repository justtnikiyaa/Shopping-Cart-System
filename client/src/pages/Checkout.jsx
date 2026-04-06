import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { placeOrderApi } from "../services/orderService";
import { notifyError, notifySuccess } from "../utils/toast";

const initialForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  country: ""
};

function Checkout() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { items, totalAmount, isCartLoading, fetchCart } = useCart();

  const [formValues, setFormValues] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const estimatedTax = useMemo(() => Number((totalAmount * 0.08).toFixed(2)), [totalAmount]);
  const grandTotal = useMemo(() => Number((totalAmount + estimatedTax).toFixed(2)), [totalAmount, estimatedTax]);

  const validate = () => {
    const errors = {};

    if (!formValues.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formValues.phone.trim()) {
      errors.phone = "Phone is required";
    }

    if (!formValues.addressLine1.trim()) {
      errors.addressLine1 = "Address line is required";
    }

    if (!formValues.city.trim()) {
      errors.city = "City is required";
    }

    if (!formValues.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }

    if (!formValues.country.trim()) {
      errors.country = "Country is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!items.length) {
      const message = "Your cart is empty. Please add items before checkout.";
      setApiError(message);
      notifyError(message);
      return;
    }

    if (!token) {
      const message = "Please login to place order.";
      setApiError(message);
      notifyError(message);
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const shippingAddress = {
        fullName: formValues.fullName.trim(),
        phone: formValues.phone.trim(),
        addressLine1: formValues.addressLine1.trim(),
        city: formValues.city.trim(),
        state: formValues.city.trim(),
        postalCode: formValues.postalCode.trim(),
        country: formValues.country.trim()
      };

      const result = await placeOrderApi({ token, shippingAddress });

      await fetchCart();
      const message = result.message || "Order placed successfully";
      setSuccessMessage(message);
      notifySuccess(message);

      setTimeout(() => {
        navigate("/my-orders", { replace: true });
      }, 1300);
    } catch (error) {
      setApiError(error.message);
      notifyError(error.message || "Failed to place order.");
    } finally {
      setSubmitting(false);
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

  return (
    <section>
      <h1 className="text-5xl font-semibold tracking-tight text-slate-900">Checkout</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        Finalize your selection from ShopCart. Our shipping partners ensure your items arrive with care.
      </p>

      {apiError ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <CheckoutForm
          values={formValues}
          errors={formErrors}
          loading={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />

        <OrderSummary
          items={items}
          subtotal={totalAmount}
          tax={estimatedTax}
          total={grandTotal}
        />
      </div>
    </section>
  );
}

export default Checkout;
