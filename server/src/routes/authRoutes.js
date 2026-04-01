import { Router } from "express";
import {
  adminOnlySample,
  getMe,
  login,
  register
} from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/admin-only", protect, adminOnly, adminOnlySample);

export default router;
