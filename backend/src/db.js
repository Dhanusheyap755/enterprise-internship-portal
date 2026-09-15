import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, "../applications.sqlite"));

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS applications (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT NOT NULL,
 course TEXT NOT NULL,
 message TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);

export function listApplications() {
  return db.prepare(`
    SELECT id,name,email,phone,course,message,created_at
    FROM applications ORDER BY id DESC LIMIT 100
  `).all();
}

export function createApplication(data) {
  const stmt = db.prepare(`
    INSERT INTO applications (name,email,phone,course,message)
    VALUES (@name,@email,@phone,@course,@message)
  `);
  const result = stmt.run(data);
  return db.prepare(`
    SELECT id,name,email,phone,course,message,created_at
    FROM applications WHERE id = ?
  `).get(result.lastInsertRowid);
}

export function closeDatabase() { db.close(); }
