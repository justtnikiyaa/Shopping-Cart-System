import { Router } from "express";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import healthRoutes from "./healthRoutes.js";
import orderRoutes from "./orderRoutes.js";
import productRoutes from "./productRoutes.js";

const router = Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;
