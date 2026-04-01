import mongoose from "mongoose";

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    addressLine1: {
      type: String,
      required: [true, "Address line 1 is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true
    }
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"]
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"]
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"]
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"]
    },
    items: {
      type: [orderItemSchema],
      default: []
    },
    total: {
      type: Number,
      required: [true, "Order total is required"],
      min: [0, "Order total cannot be negative"]
    },
    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, "Shipping address is required"]
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
