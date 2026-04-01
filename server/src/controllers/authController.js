import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const formatAuthResponse = ({ user, token, message }) => ({
  success: true,
  message,
  data: {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new ApiError("A user with this email already exists", 409);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "user"
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
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

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
