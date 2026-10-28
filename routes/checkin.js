import express from 'express';
import bcrypt from 'bcryptjs';
import supabase, { localDb } from '../db.js';
import { requireStaff, generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/login
 * Staff authentication endpoint via Supabase & fallback
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = username.trim();
    let staffUser = null;

    // 1. Try Supabase Staff Table
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('username', cleanUsername)
        .single();

      if (!error && data) {
        staffUser = data;
      }
    } catch (supaErr) {
      // Fall through to local fallback
    }

    // 2. Local Fallback if not found in Supabase
    if (!staffUser) {
      const localStaff = localDb.prepare('SELECT * FROM staff WHERE username = ?').get(cleanUsername);
      if (localStaff) {
        staffUser = localStaff;
      }
    }

    if (!staffUser) {
      return res.status(401).json({ error: 'Invalid staff credentials.' });
    }

    // Verify password hash
    const passwordMatch = bcrypt.compareSync(password, staffUser.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid staff credentials.' });
    }

    // Generate signed session token
    const token = generateToken({
      id: staffUser.id,
      username: staffUser.username,
      role: staffUser.role,
    });

    res.setHeader(
      'Set-Cookie',
      `passgate_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return res.json({
      success: true,
      message: 'Staff authentication successful.',
      token,
      staff: {
        id: staffUser.id,
        username: staffUser.username,
        role: staffUser.role,
      },
    });
  } catch (error) {
    console.error('Staff login error:', error);
    return res.status(500).json({ error: 'Internal server error during staff login.' });
  }
});

/**
 * POST /api/logout
 * Clear staff session cookie
 */
router.post('/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    'passgate_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/staff/me
 * Check current staff authentication status
 */
router.get('/staff/me', requireStaff, (req, res) => {
  res.json({
    authenticated: true,
    staff: req.staff,
  });
});

/**
 * POST /api/checkin
 * Atomic check-in engine using Supabase with local atomic sync
 */
router.post('/checkin', requireStaff, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(400).json({
        status: 'invalid',
        error: 'Scanned ticket token is required.',
      });
    }

    const cleanToken = token.trim();
    let supaSuccess = false;

    // 1. Try Supabase Atomic Check-In
    try {
      const { data: attendee, error: fetchErr } = await supabase
        .from('attendees')
        .select('*, ticket_types(name), events(name)')
        .eq('token', cleanToken)
        .single();

      if (!fetchErr && attendee) {
        if (attendee.checked_in) {
          // Already used
          return res.json({
            status: 'used',
            source: 'supabase',
            message: 'Pass has already been used for check-in.',
            name: attendee.name,
            ticketType: attendee.ticket_types?.name || 'General',
            checked_in_at: attendee.checked_in_at,
            eventName: attendee.events?.name || 'Byte Race 2026',
          });
        }

        // Perform Atomic Update (only if checked_in is still false)
        const nowIso = new Date().toISOString();
        const { data: updated, error: updErr } = await supabase
          .from('attendees')
          .update({
            checked_in: true,
            checked_in_at: nowIso,
          })
          .eq('token', cleanToken)
          .eq('checked_in', false)
          .select('*, ticket_types(name), events(name)')
          .single();

        if (!updErr && updated) {
          // Sync to local DB
          try {
            localDb.prepare(`
              UPDATE attendees 
              SET checked_in = 1, checked_in_at = ? 
              WHERE token = ?
            `).run(nowIso, cleanToken);
          } catch {}

          return res.json({
            status: 'valid',
            source: 'supabase',
            message: 'Valid admission pass verified.',
            name: updated.name,
            ticketType: updated.ticket_types?.name || 'General',
            checked_in_at: updated.checked_in_at,
            eventName: updated.events?.name || 'Byte Race 2026',
            email: updated.email,
          });
        }
      }
    } catch (supaErr) {
      console.warn('Supabase checkin notice:', supaErr.message);
    }

    // 2. Local SQLite Atomic Fallback
    const updateStmt = localDb.prepare(`
      UPDATE attendees 
      SET checked_in = 1, checked_in_at = datetime('now') 
      WHERE token = ? AND checked_in = 0;
    `);

    const result = updateStmt.run(cleanToken);

    // Case 1: Brand new valid check-in
    if (result.changes === 1) {
      const attendee = localDb.prepare(`
        SELECT 
          a.id, a.name, a.email, a.token, a.checked_in, a.checked_in_at,
          tt.name AS ticket_type, e.name AS event_name
        FROM attendees a
        JOIN ticket_types tt ON a.ticket_type_id = tt.id
        JOIN events e ON a.event_id = e.id
        WHERE a.token = ?
      `).get(cleanToken);

      return res.json({
        status: 'valid',
        source: 'local',
        message: 'Valid admission pass verified.',
        name: attendee.name,
        ticketType: attendee.ticket_type,
        checked_in_at: attendee.checked_in_at,
        eventName: attendee.event_name,
        email: attendee.email,
      });
    }

    // Case 2: changes === 0 (Check if token exists or is invalid)
    const existingAttendee = localDb.prepare(`
      SELECT 
        a.id, a.name, a.email, a.token, a.checked_in, a.checked_in_at,
        tt.name AS ticket_type, e.name AS event_name
      FROM attendees a
      JOIN ticket_types tt ON a.ticket_type_id = tt.id
      JOIN events e ON a.event_id = e.id
      WHERE a.token = ?
    `).get(cleanToken);

    if (!existingAttendee) {
      return res.json({
        status: 'invalid',
        message: 'Unrecognized pass or invalid token.',
      });
    }

    return res.json({
      status: 'used',
      source: 'local',
      message: 'Pass has already been used for check-in.',
      name: existingAttendee.name,
      ticketType: existingAttendee.ticket_type,
      checked_in_at: existingAttendee.checked_in_at,
      eventName: existingAttendee.event_name,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({
      status: 'invalid',
      error: 'Internal server error while processing check-in.',
    });
  }
});

export default router;
