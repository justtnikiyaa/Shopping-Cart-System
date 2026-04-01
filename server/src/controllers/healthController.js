import mongoose from "mongoose";

const healthCheck = (req, res) => {
  const readyStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };

  res.status(200).json({
    success: true,
    message: "Server is healthy",
    environment: process.env.NODE_ENV || "development",
    database: readyStates[mongoose.connection.readyState] || "unknown",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
};

export { healthCheck };
