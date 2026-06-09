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

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const { hash } = req.body;
  const user = req.user;
  const db = readDb();

  const match = db.evidence.find(e => e.hash === hash);
  if (!match) {
    return res.json({ result: null });
  }

  // Filter based on role
  if (user.role === "public" || (user.role === "user" && user.caseId !== match.caseId)) {
    return res.json({ result: null, message: "Access restricted" });
  }
  
  db.counters.logs += 1;
  const newLog = {
    id: db.counters.logs,
    action: "VERIFY",
    user: user.name,
    details: `Verified hash ${hash} against blockchain`,
    caseId: match.caseId,
    timestamp: new Date().toISOString()
  };
  db.logs.unshift(newLog);
  writeDb(db);

  res.json({ result: match });
});

export default router;
