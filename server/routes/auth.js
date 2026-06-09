import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateToken } from "../middleware/auth.js";

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

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const db = readDb();
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (role) {
    user.role = role;
    writeDb(db);
  }

  const token = generateToken(user);
  res.json({ user, token });
});

router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const db = readDb();
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already in use" });
  }

  db.counters.users += 1;
  const newUser = {
    id: db.counters.users,
    name,
    email,
    password,
    role: role || "admin",
    caseId: null,
    avatar: name[0]?.toUpperCase() || "U"
  };

  db.users.push(newUser);
  writeDb(db);

  const token = generateToken(newUser);
  res.json({ user: newUser, token });
});

router.post("/google", (req, res) => {
  const names = ["Arya", "Priya", "James", "Alexandra"];
  const pick = names[Math.floor(Math.random() * names.length)];
  
  const mockUser = {
    id: Math.floor(Math.random() * 10000) + 1000,
    name: pick,
    email: `${pick.toLowerCase()}@gmail.com`,
    role: "admin",
    caseId: null,
    avatar: pick[0]
  };

  const token = generateToken(mockUser);
  res.json({ user: mockUser, token });
});

export default router;
