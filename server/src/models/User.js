import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import env from "../config/env.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      select: false,
      minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github", "passkey"],
      default: "local"
    },
    oauthProviders: {
      type: [String],
      default: []
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    passkeyEnabled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("validate", function preValidate(next) {
  if (this.authProvider === "local" && !this.password) {
    this.invalidate("password", "Password is required");
  }

  next();
});

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password") || !this.password) {
    next();
    return;
  }

  const rounds = Number.isInteger(env.bcryptSaltRounds) ? env.bcryptSaltRounds : 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
