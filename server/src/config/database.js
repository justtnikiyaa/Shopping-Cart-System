import mongoose from "mongoose";
import env from "./env.js";

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(env.mongoUri);

  console.log(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

export default connectDatabase;
