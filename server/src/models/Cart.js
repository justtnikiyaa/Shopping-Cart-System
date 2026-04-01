import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Subtotal cannot be negative"]
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      min: [0, "Total items cannot be negative"]
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
