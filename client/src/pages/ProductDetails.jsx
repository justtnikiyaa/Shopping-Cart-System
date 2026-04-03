import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addItemToCart, getProductById } from "../services/productService";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(amount || 0);

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getProductById(productId);

        if (!result) {
          setError("Product not found");
          return;
        }

        setProduct(result);
        setQuantity(1);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const maxStock = useMemo(() => Math.max(0, Number(product?.stock || 0)), [product?.stock]);

  const canDecrease = quantity > 1;
  const canIncrease = quantity < maxStock;
  const outOfStock = maxStock <= 0;

  const increaseQuantity = () => {
    setFeedbackMessage("");

    if (quantity >= maxStock) {
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setFeedbackMessage("");

    if (quantity <= 1) {
      return;
    }

    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (outOfStock) {
      setFeedbackMessage("This product is currently out of stock.");
      return;
    }

    if (quantity < 1) {
      setFeedbackMessage("Quantity must be at least 1.");
      return;
    }

    if (quantity > maxStock) {
      setFeedbackMessage("You cannot add more than available stock.");
      return;
    }

    setAddingToCart(true);
    setFeedbackMessage("");

    try {
      const result = await addItemToCart({
        productId: product._id,
        quantity
      });

      setFeedbackMessage(result.message || "Item added to cart successfully.");
    } catch (addError) {
      setFeedbackMessage(addError.message);

      if (addError.message.toLowerCase().includes("login")) {
        navigate("/login", { state: { from: { pathname: `/products/${product._id}` } } });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" />
        <div className="h-[520px] animate-pulse rounded-3xl bg-slate-200" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-lg font-semibold text-red-700">Failed to load product</p>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Link to="/products" className="mt-4 inline-block rounded-xl bg-[#1f3b7a] px-4 py-2 text-sm font-semibold text-white">
          Back to Products
        </Link>
      </section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <section>
      <p className="mb-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        <Link to="/" className="hover:text-[#1f3b7a]">Home</Link> / <Link to="/products" className="hover:text-[#1f3b7a]">Products</Link> / Product Details
      </p>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img
              src={product.image || "https://placehold.co/1200x1200/e2e8f0/475569?text=ShopCart"}
              alt={product.name}
              className="h-[420px] w-full object-cover sm:h-[560px]"
              onError={(event) => {
                event.currentTarget.src = "https://placehold.co/1200x1200/e2e8f0/475569?text=ShopCart";
              }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="inline-block rounded-full bg-[#e8efff] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#1f3b7a]">
            {product.category?.name || "Uncategorized"}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{product.name}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Price</span>
              <span className="text-2xl font-bold text-[#1f3b7a]">{formatCurrency(product.price)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Stock</span>
              <span className={`text-sm font-semibold ${outOfStock ? "text-red-600" : "text-emerald-600"}`}>
                {outOfStock ? "Out of stock" : `${maxStock} available`}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Select Qty</p>
            <div className="mt-2 flex w-fit items-center gap-3 rounded-xl border border-slate-300 bg-white p-2">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!canDecrease}
                className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                -
              </button>
              <span className="min-w-8 text-center text-base font-semibold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={increaseQuantity}
                disabled={!canIncrease}
                className="h-9 w-9 rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>

            {quantity > maxStock && !outOfStock ? (
              <p className="mt-2 text-sm text-red-600">You cannot select more than available stock.</p>
            ) : null}
          </div>

          {feedbackMessage ? (
            <p className={`mt-4 rounded-xl px-3 py-2 text-sm ${feedbackMessage.toLowerCase().includes("success") || feedbackMessage.toLowerCase().includes("added") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {feedbackMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || outOfStock}
              className="rounded-full bg-[#1f3b7a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#182f63] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

            <Link
              to="/products"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View More Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
