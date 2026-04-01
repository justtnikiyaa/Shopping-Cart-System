import app from "./app.js";
import connectDatabase from "./config/database.js";
import env from "./config/env.js";

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);

  if (server) {
    server.close(() => process.exit(1));
    return;
  }

  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});

startServer();
