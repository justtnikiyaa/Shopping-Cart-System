import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  addCartItemApi,
  clearCartApi,
  fetchCartApi,
  removeCartItemApi,
  updateCartItemApi
} from "../services/cartService";

const defaultCart = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

const CartContext = createContext(null);

function CartProvider({ children }) {
  const { token, isAuthenticated, isAuthLoading } = useAuth();

  const [cart, setCart] = useState(defaultCart);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isCartMutating, setIsCartMutating] = useState(false);
  const [cartError, setCartError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  const applyCart = (nextCart) => {
    const safeCart = {
      items: nextCart?.items || [],
      totalItems: Number(nextCart?.totalItems || 0),
      totalAmount: Number(nextCart?.totalAmount || 0)
    };

    setCart(safeCart);
    localStorage.setItem("cart", JSON.stringify(safeCart));
  };

  const resetCartState = () => {
    setCart(defaultCart);
    setCartError("");
    setCartMessage("");
    localStorage.removeItem("cart");
  };

  const fetchCart = async () => {
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
  };

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      resetCartState();
      return;
    }

    fetchCart();
  }, [isAuthenticated, token, isAuthLoading]);

  const addToCart = async ({ productId, quantity }) => {
    if (!token) {
      throw new Error("Please login to add items to your cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await addCartItemApi({ token, productId, quantity });
      applyCart(updatedCart);
      setCartMessage(message);
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  };

  const updateQuantity = async ({ productId, quantity }) => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await updateCartItemApi({ token, productId, quantity });
      applyCart(updatedCart);
      setCartMessage(message);
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await removeCartItemApi({ token, productId });
      applyCart(updatedCart);
      setCartMessage(message);
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  };

  const clearCart = async () => {
    if (!token) {
      throw new Error("Please login to update cart");
    }

    setIsCartMutating(true);
    setCartError("");

    try {
      const { cart: updatedCart, message } = await clearCartApi(token);
      applyCart(updatedCart);
      setCartMessage(message);
      return { cart: updatedCart, message };
    } catch (error) {
      setCartError(error.message);
      throw error;
    } finally {
      setIsCartMutating(false);
    }
  };

  const clearMessages = () => {
    setCartError("");
    setCartMessage("");
  };

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
    [cart, isCartLoading, isCartMutating, cartError, cartMessage]
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
