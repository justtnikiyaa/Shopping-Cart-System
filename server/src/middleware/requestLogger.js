import env from "../config/env.js";

const requestLogger = (req, res, next) => {
  if (env.nodeEnv === "test") {
    next();
    return;
  }

  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`
    );
  });

  next();
};

export default requestLogger;
