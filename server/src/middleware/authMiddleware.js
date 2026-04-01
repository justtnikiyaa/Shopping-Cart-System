import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Unauthorized: token missing", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError("Unauthorized: invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError("Unauthorized: user no longer exists", 401);
  }

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
});

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    next(new ApiError("Forbidden: admin access required", 403));
    return;
  }

  next();
};

export { protect, adminOnly };
