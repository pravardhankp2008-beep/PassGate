import { createClient } from '@supabase/supabase-js';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://xbcnuutbvwdmitkptzcd.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_x-qTffgSQJNdm5q2i9mdoA_7ZoJwO98';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Local SQLite Instance (High-speed local cache & fallback engine)
const dbPath = process.env.DB_FILE || path.join(__dirname, 'database.sqlite');
const localDb = new Database(dbPath);
localDb.pragma('journal_mode = WAL');
localDb.pragma('foreign_keys = ON');

let isSupabaseSchemaAvailable = false;

/**
 * Initialize local SQLite schema ensuring zero downtime during demo
 */
export function initLocalSchema() {
  localDb.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      venue TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 100,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ticket_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      ticket_limit INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attendees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      ticket_type_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      token TEXT UNIQUE NOT NULL,
      checked_in INTEGER DEFAULT 0,
      checked_in_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES events(id),
      FOREIGN KEY(ticket_type_id) REFERENCES ticket_types(id)
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'staff',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_attendees_token ON attendees(token);
    CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON attendees(event_id);
    CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON attendees(checked_in);
  `);

  // Seed default staff user if missing
  const checkStaff = localDb.prepare('SELECT id FROM staff WHERE username = ?').get('staff');
  if (!checkStaff) {
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync('password123', saltRounds);
    localDb.prepare('INSERT INTO staff (username, password_hash, role) VALUES (?, ?, ?)').run('staff', passwordHash, 'admin');
  }

  // Seed sample event if missing
  const checkEvent = localDb.prepare('SELECT id FROM events WHERE name = ?').get('Byte Race 2026 Opening Ceremony');
  if (!checkEvent) {
    const insertTx = localDb.transaction(() => {
      const eRes = localDb.prepare(
        'INSERT INTO events (name, date, venue, capacity) VALUES (?, ?, ?, ?)'
      ).run('Byte Race 2026 Opening Ceremony', '2026-11-01 10:00:00', 'Main Hackathon Arena, Tech Hub', 100);
      const eId = eRes.lastInsertRowid;

      const gRes = localDb.prepare('INSERT INTO ticket_types (event_id, name, ticket_limit) VALUES (?, ?, ?)').run(eId, 'General', 80);
      const vRes = localDb.prepare('INSERT INTO ticket_types (event_id, name, ticket_limit) VALUES (?, ?, ?)').run(eId, 'VIP', 20);

      const insAtt = localDb.prepare(
        'INSERT INTO attendees (event_id, ticket_type_id, name, email, phone, token) VALUES (?, ?, ?, ?, ?, ?)'
      );
      insAtt.run(eId, gRes.lastInsertRowid, 'Alex Rivers', 'alex.rivers@example.com', '+1-555-0199', 'PASS-BR26-ALEX-001');
      insAtt.run(eId, vRes.lastInsertRowid, 'Elena Vance', 'elena.vance@example.com', '+1-555-0244', 'PASS-BR26-ELENA-002');
    });
    insertTx();
  }
}

/**
 * Verify remote Supabase connectivity
 */
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    if (error) {
      if (error.code === 'PGRST205') {
        console.log('ℹ️  [Supabase] Remote database connected! Note: Tables not detected yet in public schema. Run "supabase-schema.sql" in your Supabase SQL Editor to activate cloud storage.');
        isSupabaseSchemaAvailable = false;
      } else {
        console.warn('⚠️  [Supabase] Note:', error.message);
        isSupabaseSchemaAvailable = false;
      }
    } else {
      console.log('⚡ [Supabase] Cloud database verified! Tables detected and live.');
      isSupabaseSchemaAvailable = true;
    }
  } catch (err) {
    console.warn('⚠️  [Supabase] Connection test notice:', err.message);
    isSupabaseSchemaAvailable = false;
  }
  return isSupabaseSchemaAvailable;
}

// Initialize tables immediately
initLocalSchema();
checkSupabaseConnection();

export { localDb, isSupabaseSchemaAvailable };
export default supabase;
