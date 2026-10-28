import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { parse } from 'csv-parse/sync';
import supabase, { localDb } from '../db.js';
import { requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (max 5MB CSV file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * GET /api/events/:id/report.csv
 * Export full event attendance report as downloadable CSV via Supabase with local fallback
 * Protected by staff authentication
 */
router.get('/events/:id/report.csv', requireStaff, async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).send('Invalid event ID parameter.');
    }

    let attendees = [];

    // 1. Try fetching from Supabase
    try {
      const { data: supaAttendees, error: attErr } = await supabase
        .from('attendees')
        .select('*, ticket_types(name), events(name)')
        .eq('event_id', eventId)
        .order('checked_in', { ascending: false });

      if (!attErr && supaAttendees && supaAttendees.length > 0) {
        attendees = supaAttendees.map((a) => ({
          name: a.name,
          email: a.email,
          phone: a.phone || '',
          ticket_type: a.ticket_types?.name || 'General',
          created_at: a.created_at,
          checked_in: a.checked_in ? 'Yes' : 'No',
          checked_in_at: a.checked_in_at || 'N/A',
          token: a.token,
        }));
      }
    } catch (supaErr) {
      // Fall through to local fallback
    }

    // 2. Local Fallback if Supabase had no rows or was unreachable
    if (attendees.length === 0) {
      const localRows = localDb.prepare(`
        SELECT 
          a.id,
          a.name,
          a.email,
          a.phone,
          a.token,
          a.checked_in,
          a.checked_in_at,
          a.created_at,
          tt.name AS ticket_type,
          e.name AS event_name
        FROM attendees a
        JOIN ticket_types tt ON a.ticket_type_id = tt.id
        JOIN events e ON a.event_id = e.id
        WHERE a.event_id = ?
        ORDER BY a.checked_in DESC, a.checked_in_at DESC, a.name ASC
      `).all(eventId);

      attendees = localRows.map((a) => ({
        name: a.name,
        email: a.email,
        phone: a.phone || '',
        ticket_type: a.ticket_type,
        created_at: a.created_at,
        checked_in: a.checked_in === 1 ? 'Yes' : 'No',
        checked_in_at: a.checked_in_at || 'N/A',
        token: a.token,
      }));
    }

    // CSV Header row
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Ticket Type',
      'Registered At',
      'Checked In',
      'Check-in Time',
      'Token'
    ];

    const csvRows = [headers.map(escapeCsv).join(',')];

    for (const a of attendees) {
      const row = [
        escapeCsv(a.name),
        escapeCsv(a.email),
        escapeCsv(a.phone),
        escapeCsv(a.ticket_type),
        escapeCsv(a.created_at),
        escapeCsv(a.checked_in),
        escapeCsv(a.checked_in_at),
        escapeCsv(a.token)
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\r\n');
    const safeFilename = `event-${eventId}-attendance-report.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    return res.status(200).send(csvContent);

  } catch (error) {
    console.error('Error generating CSV report:', error);
    return res.status(500).send('Failed to generate attendance report.');
  }
});

/**
 * POST /api/events/:id/import-csv
 * Bulk import attendees from an uploaded CSV file into Supabase & local DB
 * Protected by staff authentication
 */
router.post('/events/:id/import-csv', requireStaff, upload.single('file'), async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Valid numeric event ID is required.' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'Please upload a valid .csv file under field name "file".' });
    }

    // Parse CSV content
    let rawRecords;
    try {
      rawRecords = parse(req.file.buffer.toString('utf8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (parseErr) {
      return res.status(400).json({ error: `CSV parsing error: ${parseErr.message}` });
    }

    if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
      return res.status(400).json({ error: 'The uploaded CSV file is empty.' });
    }

    // Fetch existing ticket types
    let ticketTypes = [];
    try {
      const { data: supaTickets } = await supabase.from('ticket_types').select('*').eq('event_id', eventId);
      if (supaTickets && supaTickets.length > 0) ticketTypes = supaTickets;
    } catch {}

    if (ticketTypes.length === 0) {
      ticketTypes = localDb.prepare('SELECT id, name, ticket_limit FROM ticket_types WHERE event_id = ?').all(eventId);
    }

    if (ticketTypes.length === 0) {
      return res.status(400).json({ error: 'No ticket types defined for this event.' });
    }

    const ticketTypeMap = new Map();
    for (const tt of ticketTypes) {
      ticketTypeMap.set(String(tt.id), tt);
      ticketTypeMap.set(tt.name.toLowerCase().trim(), tt);
    }

    const imported = [];
    const skipped = [];
    const recordsToInsert = [];

    for (let i = 0; i < rawRecords.length; i++) {
      const row = rawRecords[i];
      const rowNum = i + 2;

      const normalized = {};
      for (const [key, val] of Object.entries(row)) {
        normalized[key.toLowerCase().trim().replace(/[\s_-]+/g, '')] = (val || '').trim();
      }

      const name = normalized['name'] || normalized['fullname'] || normalized['attendeename'];
      const email = normalized['email'] || normalized['emailaddress'];
      const phone = normalized['phone'] || normalized['phonenumber'] || null;
      const ticketKey = normalized['tickettypename'] || normalized['tickettype'] || normalized['tickettypeid'] || normalized['ticket'];

      if (!name || !email) {
        skipped.push({ row: rowNum, name: name || 'N/A', email: email || 'N/A', reason: 'Missing required name or email' });
        continue;
      }

      let targetTicketType = null;
      if (ticketKey) {
        targetTicketType = ticketTypeMap.get(ticketKey.toLowerCase()) || ticketTypeMap.get(ticketKey);
      }
      if (!targetTicketType) {
        targetTicketType = ticketTypes[0];
      }

      const token = crypto.randomBytes(16).toString('hex');

      recordsToInsert.push({
        event_id: eventId,
        ticket_type_id: targetTicketType.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        token: token,
        checked_in: false,
        ticket_type_name: targetTicketType.name
      });
    }

    // Try Supabase Batch Insertion
    try {
      const supaInserts = recordsToInsert.map(r => ({
        event_id: r.event_id,
        ticket_type_id: r.ticket_type_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        token: r.token,
        checked_in: false
      }));

      await supabase.from('attendees').insert(supaInserts);
    } catch (supaErr) {
      console.warn('Supabase bulk insert notice:', supaErr.message);
    }

    // Sync into local SQLite
    const insertLocalStmt = localDb.prepare(`
      INSERT INTO attendees (event_id, ticket_type_id, name, email, phone, token)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const localTx = localDb.transaction((items) => {
      for (const item of items) {
        const res = insertLocalStmt.run(
          item.event_id,
          item.ticket_type_id,
          item.name,
          item.email,
          item.phone,
          item.token
        );
        imported.push({
          id: res.lastInsertRowid,
          name: item.name,
          email: item.email,
          ticket_type: item.ticket_type_name,
          token: item.token
        });
      }
    });

    localTx(recordsToInsert);

    return res.status(200).json({
      success: true,
      message: `Bulk import completed: ${imported.length} attendees added to event.`,
      imported_count: imported.length,
      skipped_count: skipped.length,
      imported,
      skipped
    });

  } catch (error) {
    console.error('Error during CSV bulk import:', error);
    return res.status(500).json({ error: 'Internal server error during bulk import processing.' });
  }
});

export default router;
