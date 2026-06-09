import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../db.json");

const router = express.Router();

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

router.get("/", (req, res) => {
  const user = req.user;
  const db = readDb();

  if (user.role === "admin") {
    return res.json(db.logs);
  } else if (user.role === "user") {
    return res.json(db.logs.filter(l => l.caseId === user.caseId));
  } else {
    return res.json([]);
  }
});

export default router;
