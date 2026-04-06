import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const emailRegex = /^\S+@\S+\.\S+$/;

const formatAuthResponse = ({ user, token, message }) => ({
  success: true,
  message,
  data: {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider || "local",
      passkeyEnabled: Boolean(user.passkeyEnabled)
    },
    token
  }
});

const validatePasswordStrength = (password) => {
  if (password.length < 8) {
    throw new ApiError("Password must be at least 8 characters", 400);
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    throw new ApiError("Password must contain at least one letter and one number", 400);
  }
};

const register = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.toLowerCase()?.trim();
  const password = req.body.password;

  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required", 400);
  }

  if (!emailRegex.test(email)) {
    throw new ApiError("Please provide a valid email address", 400);
  }

  validatePasswordStrength(password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError("A user with this email already exists", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    authProvider: "local"
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json(
    formatAuthResponse({
      user,
      token,
      message: "User registered successfully"
    })
  );
});

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase()?.trim();
  const password = req.body.password;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  if (!emailRegex.test(email)) {
    throw new ApiError("Please provide a valid email address", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid email or password", 401);
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json(
    formatAuthResponse({
      user,
      token,
      message: "Login successful"
    })
  );
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: {
      user: req.user
    }
  });
});

const adminOnlySample = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    data: {
      user: req.user
    }
  });
});

export { register, login, getMe, adminOnlySample };
