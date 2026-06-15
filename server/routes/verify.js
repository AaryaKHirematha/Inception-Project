import express from "express";
import { readDb, writeDb } from "../db.js";

const router = express.Router();

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
