import express from "express";
import cors from "cors";
import env from "./config/env.js";
import routes from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import requestSanitizer from "./middleware/requestSanitizer.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(requestSanitizer);
app.use(requestLogger);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
