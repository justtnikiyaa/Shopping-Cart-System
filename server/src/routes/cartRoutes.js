import { Router } from "express";
import {
  addItemToCart,
  clearCart,
  getUserCart,
  removeCartItem,
  updateCartItemQuantity
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getUserCart);
router.post("/items", addItemToCart);
router.put("/items/:productId", updateCartItemQuantity);
router.delete("/items/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;
