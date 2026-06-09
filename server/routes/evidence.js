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

router.get("/", (req, res) => {
  const user = req.user;
  const db = readDb();

  let result = [];
  if (user.role === "admin") {
    result = db.evidence;
  } else if (user.role === "user") {
    result = db.evidence.filter(e => e.caseId === user.caseId);
  } else {
    // Public - redact sensitive info
    result = db.evidence.map(e => ({
      ...e,
      fileName: e.fileName.replace(/^(.{3}).*(.{4})$/, "$1***$2"),
      hash: e.hash.replace(/^(.{4}).*(.{4})$/, "$1***$2"),
    }));
  }
  
  res.json(result);
});

router.post("/", (req, res) => {
  const user = req.user;
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can upload evidence." });
  }

  const { fileName, fileSize, caseId } = req.body;
  const db = readDb();
  
  db.counters.evidence += 1;
  const newEv = {
    id: db.counters.evidence,
    caseId: caseId || `CASE-2023-00${Math.floor(Math.random() * 9) + 1}`,
    fileName,
    fileSize,
    hash: Math.random().toString(16).substring(2, 10) + "..." + Math.random().toString(16).substring(2, 6),
    uploadDate: new Date().toISOString(),
    uploadedBy: user.name,
    status: "Verified"
  };

  db.evidence.unshift(newEv);
  
  db.counters.logs += 1;
  const newLog = {
    id: db.counters.logs,
    action: "UPLOAD",
    user: user.name,
    details: `Uploaded ${fileName}`,
    caseId: newEv.caseId,
    timestamp: new Date().toISOString()
  };
  
  db.logs.unshift(newLog);

  writeDb(db);
  res.json(newEv);
});

export default router;
