import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import evidenceRoutes from "./routes/evidence.js";
import verifyRoutes from "./routes/verify.js";
import logsRoutes from "./routes/logs.js";
import { authenticate } from "./middleware/auth.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/evidence", authenticate, evidenceRoutes);
app.use("/api/verify", authenticate, verifyRoutes);
app.use("/api/logs", authenticate, logsRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

export default app;
