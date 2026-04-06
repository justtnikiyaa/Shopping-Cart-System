import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  addCartItemApi,
  clearCartApi,
  fetchCartApi,
  removeCartItemApi,
  updateCartItemApi
} from "../services/cartService";
import { notifyError, notifySuccess } from "../utils/toast";

const defaultCart = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

const CartContext = createContext(null);

const readCachedCart = () => {
  try {
    const rawCart = localStorage.getItem("cart");

    if (!rawCart) {
      return defaultCart;
    }

    const parsed = JSON.parse(rawCart);

    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      totalItems: Number(parsed.totalItems || 0),
      totalAmount: Number(parsed.totalAmount || 0)
    };
  } catch {
    return defaultCart;
  }
};

function CartProvider({ children }) {
  const { token, isAuthenticated, isAuthLoading } = useAuth();

  const [cart, setCart] = useState(readCachedCart);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isCartMutating, setIsCartMutating] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const applyCart = useCallback((nextCart) => {
    const safeCart = {
      items: nextCart?.items || [],
      totalItems: Number(nextCart?.totalItems || 0),
      totalAmount: Number(nextCart?.totalAmount || 0)
    };

    setCart(safeCart);
    localStorage.setItem("cart", JSON.stringify(safeCart));
  }, []);

  const resetCartState = useCallback(() => {
    setCart(defaultCart);
    setCartError("");
    setCartMessage("");
    localStorage.removeItem("cart");
  }, []);

  const fetchCart = useCallback(async () => {
    if (!token) {
      resetCartState();
      return;
    }

    setIsCartLoading(true);
    setCartError("");

    try {
      const { cart: fetchedCart } = await fetchCartApi(token);
      applyCart(fetchedCart);
    } catch (error) {
      setCartError(error.message);
      applyCart(defaultCart);
    } finally {
      setIsCartLoading(false);
    }
  }, [token, resetCartState, applyCart]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      resetCartState();
      return;
    }

    fetchCart();
  }, [isAuthenticated, token, isAuthLoading, fetchCart, resetCartState]);

  const addToCart = useCallback(async ({ productId, quantity }) => {
    if (!token) {
      throw new Error("Please login to add items to your cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await addCartItemApi({ token, productId, quantity });
      applyCart(updatedCart);
      setCartMessage(message);
      notifySuccess(message || "Item added to cart.");
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      notifyError(error.message || "Failed to add item to cart.");
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  }, [token, applyCart]);

  const updateQuantity = useCallback(async ({ productId, quantity }) => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await updateCartItemApi({ token, productId, quantity });
      applyCart(updatedCart);
      setCartMessage(message);
      notifySuccess(message || "Cart updated successfully.");
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      notifyError(error.message || "Failed to update cart.");
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  }, [token, applyCart]);

  const removeFromCart = useCallback(async (productId) => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await removeCartItemApi({ token, productId });
      applyCart(updatedCart);
      setCartMessage(message);
      notifySuccess(message || "Item removed from cart.");
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      notifyError(error.message || "Failed to remove item from cart.");
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  }, [token, applyCart]);

  const clearCart = useCallback(async () => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await clearCartApi(token);
      applyCart(updatedCart);
      setCartMessage(message);
      notifySuccess(message || "Cart cleared successfully.");
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      notifyError(error.message || "Failed to clear cart.");
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  }, [token, applyCart]);

  const clearMessages = useCallback(() => {
    setCartError("");
    setCartMessage("");
  }, []);

  const value = useMemo(
    () => ({
      cart,
      items: cart.items,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      isCartLoading,
      isCartMutating,
      cartError,
      cartMessage,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      clearMessages
    }),
    [
      cart,
      isCartLoading,
      isCartMutating,
      cartError,
      cartMessage,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      clearMessages
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
};

export { CartProvider, useCart };
