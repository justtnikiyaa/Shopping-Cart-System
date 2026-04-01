import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered"];

const ensureValidObjectId = (value, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(`Invalid ${fieldName}`, 400);
  }
};

const normalizeShippingAddress = (shippingAddress = {}) => ({
  fullName: shippingAddress.fullName?.trim(),
  addressLine1: shippingAddress.addressLine1?.trim(),
  city: shippingAddress.city?.trim(),
  state: shippingAddress.state?.trim(),
  postalCode: shippingAddress.postalCode?.trim(),
  country: shippingAddress.country?.trim(),
  phone: shippingAddress.phone?.trim()
});

const validateShippingAddress = (address) => {
  const requiredFields = [
    address.fullName,
    address.addressLine1,
    address.city,
    address.state,
    address.postalCode,
    address.country,
    address.phone
  ];

  if (requiredFields.some((field) => !field)) {
    throw new ApiError(
      "Shipping address requires fullName, addressLine1, city, state, postalCode, country, and phone",
      400
    );
  }
};

const placeOrder = asyncHandler(async (req, res) => {
  const shippingAddress = normalizeShippingAddress(req.body.shippingAddress);
  validateShippingAddress(shippingAddress);

  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "items.product",
    "name price image stock"
  );

  if (!cart || cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  let total = 0;
  const orderItems = cart.items.map((item) => {
    const product = item.product;

    if (!product) {
      throw new ApiError("One or more products in cart no longer exist", 400);
    }

    if (item.quantity > product.stock) {
      throw new ApiError(`Insufficient stock for product: ${product.name}`, 400);
    }

    const subtotal = Number((product.price * item.quantity).toFixed(2));
    total += subtotal;

    return {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
      subtotal
    };
  });

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    total: Number(total.toFixed(2)),
    shippingAddress,
    status: "pending"
  });

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;
  await cart.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product", "name image");

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: {
      order: populatedOrder
    }
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product", "name image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "User orders fetched successfully",
    data: {
      count: orders.length,
      orders
    }
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email role")
    .populate("items.product", "name image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All orders fetched successfully",
    data: {
      count: orders.length,
      orders
    }
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  ensureValidObjectId(orderId, "orderId");

  if (!status || !ORDER_STATUSES.includes(status)) {
    throw new ApiError(
      "Invalid status. Allowed values: pending, processing, shipped, delivered",
      400
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  order.status = status;
  await order.save();

  const populatedOrder = await Order.findById(order._id)
    .populate("user", "name email")
    .populate("items.product", "name image");

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: {
      order: populatedOrder
    }
  });
});

export { getAllOrders, getMyOrders, placeOrder, updateOrderStatus };
