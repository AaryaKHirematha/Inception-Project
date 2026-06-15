import express from "express";
import { readDb } from "../db.js";

const router = express.Router();

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
