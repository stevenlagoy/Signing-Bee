import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import usersRouter from "./routes/users.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

const app = express();
let server;
const PORT = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const FRONTEND_BUILD_PATH = join(__dirname, "../frontend/dist");

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_BUILD_PATH));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Let React handle routing for any non-API request.
app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(join(FRONTEND_BUILD_PATH, "index.html"));
});

// Only start server if this file is run directly
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, (err) => {
    if (err) {
      console.error(`Failed to start server on port ${PORT}:`, err.message);
      process.exit(1);
    }
    console.log(`Server running on port ${PORT}`);
  });
}

export { server };
export default app;
