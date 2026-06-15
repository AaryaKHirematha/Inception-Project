import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

let dbInMemory = null;

export function readDb() {
  if (dbInMemory) return dbInMemory;
  try {
    const raw = fs.readFileSync(dbPath, "utf-8");
    dbInMemory = JSON.parse(raw);
    return dbInMemory;
  } catch (e) {
    return { users: [], evidence: [], logs: [], counters: { users: 0, evidence: 0, logs: 0 } };
  }
}

export function writeDb(data) {
  dbInMemory = data;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn("Could not write to file system (likely read-only on Vercel), using in-memory fallback:", e.message);
  }
}
