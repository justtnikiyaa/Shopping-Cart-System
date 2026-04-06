import dotenv from "dotenv";

dotenv.config();

const getEnv = (key, fallback) => {
  const value = process.env[key] ?? fallback;

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const getOptionalEnv = (key, fallback = "") => {
  return process.env[key] ?? fallback;
};

const env = {
  port: Number(getEnv("PORT", 5000)),
  nodeEnv: getEnv("NODE_ENV", "development"),
  clientUrl: getEnv("CLIENT_URL", "http://localhost:5173"),
  mongoUri: getEnv("MONGO_URI"),
  jwtSecret: getEnv("JWT_SECRET"),
  jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "7d"),
  bcryptSaltRounds: Number(getEnv("BCRYPT_SALT_ROUNDS", 10)),
  cloudinaryCloudName: getOptionalEnv("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: getOptionalEnv("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: getOptionalEnv("CLOUDINARY_API_SECRET")
};

export default env;
