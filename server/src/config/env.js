import dotenv from "dotenv";

dotenv.config();

const getEnv = (key, fallback) => {
  const value = process.env[key] ?? fallback;

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const env = {
  port: Number(getEnv("PORT", 5000)),
  nodeEnv: getEnv("NODE_ENV", "development"),
  clientUrl: getEnv("CLIENT_URL", "http://localhost:5173"),
  mongoUri: getEnv("MONGO_URI")
};

export default env;
