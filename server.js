import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase, { localDb } from './db.js';
import registrationRoutes from './routes/registration.js';
import checkinRoutes from './routes/checkin.js';
import statsRoutes from './routes/stats.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', registrationRoutes);
app.use('/api', checkinRoutes);
app.use('/api', statsRoutes);
app.use('/api', reportRoutes);

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  let supaStatus = 'checking';
  try {
    const { data, error } = await supabase.from('events').select('id').limit(1);
    supaStatus = error
      ? (error.code === 'PGRST205' ? 'connected (schema pending in SQL editor)' : error.message)
      : 'connected (live cloud schema)';
  } catch (err) {
    supaStatus = err.message;
  }

  const localRow = localDb.prepare('SELECT 1 AS alive').get();

  res.json({
    status: 'ok',
    service: 'PassGate Ticketing & Check-In System',
    supabase: {
      url: process.env.VITE_SUPABASE_URL || 'https://xbcnuutbvwdmitkptzcd.supabase.co',
      status: supaStatus,
      client: '@supabase/supabase-js initialized',
    },
    localEngine: localRow?.alive === 1 ? 'connected (WAL mode active)' : 'error',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Events Overview Endpoint
 * GET /api/events
 */
app.get('/api/events', async (req, res) => {
  try {
    // 1. Try Supabase
    try {
      const { data: events, error: evErr } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: false });

      if (!evErr && events && events.length > 0) {
        const { data: ticketTypes } = await supabase.from('ticket_types').select('*');
        const { data: attendees } = await supabase.from('attendees').select('*, ticket_types(name), events(name)');

        return res.json({
          source: 'supabase',
          events,
          ticketTypes: ticketTypes || [],
          attendees: (attendees || []).map((a) => ({
            id: a.id,
            name: a.name,
            email: a.email,
            token: a.token,
            checked_in: a.checked_in,
            checked_in_at: a.checked_in_at,
            ticket_type: a.ticket_types?.name || 'General',
            event_name: a.events?.name || 'Byte Race 2026',
          })),
        });
      }
    } catch {}

    // 2. Local Fallback
    const events = localDb.prepare('SELECT * FROM events ORDER BY id DESC').all();
    const ticketTypes = localDb.prepare('SELECT * FROM ticket_types').all();
    const attendees = localDb.prepare(`
      SELECT 
        a.id, a.name, a.email, a.token, a.checked_in, a.checked_in_at,
        tt.name AS ticket_type, e.name AS event_name
      FROM attendees a
      JOIN ticket_types tt ON a.ticket_type_id = tt.id
      JOIN events e ON a.event_id = e.id
    `).all();

    res.json({
      source: 'local',
      events,
      ticketTypes,
      attendees,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start HTTP server
app.listen(PORT, () => {
  const supaUrl = process.env.VITE_SUPABASE_URL || 'https://xbcnuutbvwdmitkptzcd.supabase.co';
  console.log(`
=====================================================
  🎟️  PassGate Event Ticketing & Check-In Server
=====================================================
  🚀 Server running on: http://localhost:${PORT}
  ⚡ Supabase URL:     ${supaUrl}
  🔍 Health Check:     http://localhost:${PORT}/api/health
  📊 Events API:       http://localhost:${PORT}/api/events
  💾 Database:         Supabase Cloud with High-Speed WAL Fallback
=====================================================
  `);
});
