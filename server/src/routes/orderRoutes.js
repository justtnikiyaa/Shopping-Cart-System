import { Router } from "express";
import {
  getAllOrders,
  getMyOrders,
  placeOrder,
  updateOrderStatus
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.post("/checkout", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/", adminOnly, getAllOrders);
router.patch("/:orderId/status", adminOnly, updateOrderStatus);

export default router;
