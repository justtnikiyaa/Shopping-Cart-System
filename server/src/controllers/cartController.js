import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${fieldName}`, 400);
  }
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalItems: 0, totalAmount: 0 });
  }

  return cart;
};

const recalculateCart = async (cart) => {
  if (!cart.items.length) {
    cart.totalItems = 0;
    cart.totalAmount = 0;
    await cart.save();
    return cart;
  }

  const productIds = cart.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select("_id price stock");
  const productsMap = new Map(products.map((product) => [product._id.toString(), product]));

  let totalItems = 0;
  let totalAmount = 0;

  cart.items.forEach((item) => {
    const product = productsMap.get(item.product.toString());

    if (!product) {
      throw new ApiError("One or more products in cart no longer exist", 400);
    }

    if (item.quantity > product.stock) {
      throw new ApiError("Requested quantity exceeds available stock", 400);
    }

    item.subtotal = Number((product.price * item.quantity).toFixed(2));
    totalItems += item.quantity;
    totalAmount += item.subtotal;
  });

  cart.totalItems = totalItems;
  cart.totalAmount = Number(totalAmount.toFixed(2));

  await cart.save();
  return cart;
};

const loadCartForResponse = async (userId) => {
  return Cart.findOne({ user: userId }).populate("items.product", "name price image stock category");
};

const getUserCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  await recalculateCart(cart);
  const populatedCart = await loadCartForResponse(req.user.id);

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: {
      cart: populatedCart
    }
  });
});

const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const parsedQuantity = Number(quantity);

  if (!productId) {
    throw new ApiError("productId is required", 400);
  }

  ensureValidObjectId(productId, "productId");

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw new ApiError("Quantity must be an integer greater than 0", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const cart = await getOrCreateCart(req.user.id);
  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + parsedQuantity;

    if (newQuantity > product.stock) {
      throw new ApiError("Requested quantity exceeds available stock", 400);
    }

    existingItem.quantity = newQuantity;
  } else {
    if (parsedQuantity > product.stock) {
      throw new ApiError("Requested quantity exceeds available stock", 400);
    }

    cart.items.push({
      product: productId,
      quantity: parsedQuantity,
      subtotal: 0
    });
  }

  await recalculateCart(cart);
  const populatedCart = await loadCartForResponse(req.user.id);

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    data: {
      cart: populatedCart
    }
  });
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const parsedQuantity = Number(quantity);

  ensureValidObjectId(productId, "productId");

  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
    throw new ApiError("Quantity must be an integer greater than 0", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (parsedQuantity > product.stock) {
    throw new ApiError("Requested quantity exceeds available stock", 400);
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    throw new ApiError("Product is not in cart", 404);
  }

  item.quantity = parsedQuantity;

  await recalculateCart(cart);
  const populatedCart = await loadCartForResponse(req.user.id);

  res.status(200).json({
    success: true,
    message: "Cart item quantity updated successfully",
    data: {
      cart: populatedCart
    }
  });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  ensureValidObjectId(productId, "productId");

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);

  if (cart.items.length === initialLength) {
    throw new ApiError("Product is not in cart", 404);
  }

  await recalculateCart(cart);
  const populatedCart = await loadCartForResponse(req.user.id);

  res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
    data: {
      cart: populatedCart
    }
  });
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;
  await cart.save();

  const populatedCart = await loadCartForResponse(req.user.id);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    data: {
      cart: populatedCart
    }
  });
});

export { addItemToCart, clearCart, getUserCart, removeCartItem, updateCartItemQuantity };
