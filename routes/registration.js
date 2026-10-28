import express from 'express';
import crypto from 'crypto';
import QRCode from 'qrcode';
import supabase, { localDb } from '../db.js';

const router = express.Router();

/**
 * GET /api/events/:eventId
 * Retrieve event details and ticket types with real-time remaining capacities via Supabase
 */
router.get('/events/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    // 1. Try querying Supabase
    try {
      const { data: event, error: eventErr } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!eventErr && event) {
        const { data: ticketTypes, error: ttErr } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('event_id', eventId);

        const { data: attendees, error: attErr } = await supabase
          .from('attendees')
          .select('id, ticket_type_id')
          .eq('event_id', eventId);

        if (!ttErr) {
          const totalSold = attendees ? attendees.length : 0;
          const capacityRemaining = event.capacity - totalSold;

          const formattedTicketTypes = (ticketTypes || []).map((tt) => {
            const soldCount = (attendees || []).filter((a) => a.ticket_type_id === tt.id).length;
            const remaining = tt.ticket_limit - soldCount;
            return {
              id: tt.id,
              event_id: tt.event_id,
              name: tt.name,
              ticket_limit: tt.ticket_limit,
              sold_count: soldCount,
              remaining: Math.max(0, remaining),
              is_sold_out: remaining <= 0,
            };
          });

          return res.json({
            source: 'supabase',
            event: {
              ...event,
              total_registered: totalSold,
              capacity_remaining: Math.max(0, capacityRemaining),
              is_sold_out: capacityRemaining <= 0,
            },
            ticket_types: formattedTicketTypes,
          });
        }
      }
    } catch (supaErr) {
      // Fall through to local fallback
    }

    // 2. Local fallback if Supabase tables are not yet migrated
    const event = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const ticketTypes = localDb.prepare(`
      SELECT 
        tt.id,
        tt.event_id,
        tt.name,
        tt.ticket_limit,
        COALESCE(COUNT(a.id), 0) AS sold_count,
        (tt.ticket_limit - COALESCE(COUNT(a.id), 0)) AS remaining
      FROM ticket_types tt
      LEFT JOIN attendees a ON a.ticket_type_id = tt.id
      WHERE tt.event_id = ?
      GROUP BY tt.id
    `).all(eventId);

    const totalSoldRow = localDb.prepare(`
      SELECT COUNT(*) AS total FROM attendees WHERE event_id = ?
    `).get(eventId);

    const totalSold = totalSoldRow ? totalSoldRow.total : 0;
    const capacityRemaining = event.capacity - totalSold;

    res.json({
      source: 'local',
      event: {
        ...event,
        total_registered: totalSold,
        capacity_remaining: Math.max(0, capacityRemaining),
        is_sold_out: capacityRemaining <= 0,
      },
      ticket_types: ticketTypes.map((tt) => ({
        ...tt,
        remaining: Math.max(0, tt.remaining),
        is_sold_out: tt.remaining <= 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Failed to retrieve event details.' });
  }
});

/**
 * POST /api/register/:eventId
 * Register an attendee for an event with Supabase and generate an authentic QR code
 */
router.post('/register/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, email, phone, ticket_type_id } = req.body;

    // Basic Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    if (!ticket_type_id) {
      return res.status(400).json({ error: 'Ticket type selection is required.' });
    }

    // Generate secure 32-character hex token (16 random bytes)
    const token = crypto.randomBytes(16).toString('hex');
    let registeredRecord = null;
    let eventData = null;
    let ticketTypeData = null;

    // 1. Try Supabase Registration
    try {
      const { data: supaEvent, error: evErr } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!evErr && supaEvent) {
        eventData = supaEvent;

        // Check overall capacity
        const { count: totalSold } = await supabase
          .from('attendees')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId);

        if (totalSold >= supaEvent.capacity) {
          return res.status(400).json({ error: 'Registration closed. This event has reached its maximum capacity.' });
        }

        // Check ticket type limit
        const { data: supaTicketType, error: ttErr } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('id', ticket_type_id)
          .eq('event_id', eventId)
          .single();

        if (ttErr || !supaTicketType) {
          return res.status(400).json({ error: 'Selected ticket type is invalid for this event.' });
        }
        ticketTypeData = supaTicketType;

        const { count: ticketSold } = await supabase
          .from('attendees')
          .select('*', { count: 'exact', head: true })
          .eq('ticket_type_id', ticket_type_id);

        if (ticketSold >= supaTicketType.ticket_limit) {
          return res.status(400).json({ error: 'This ticket type is currently sold out.' });
        }

        // Insert into Supabase
        const { data: inserted, error: insErr } = await supabase
          .from('attendees')
          .insert({
            event_id: Number(eventId),
            ticket_type_id: Number(ticket_type_id),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            token: token,
            checked_in: false,
          })
          .select()
          .single();

        if (!insErr && inserted) {
          registeredRecord = inserted;
        }
      }
    } catch (supaErr) {
      console.warn('Supabase registration fallback notice:', supaErr.message);
    }

    // 2. Local SQLite Sync & Fallback
    const registrationTx = localDb.transaction((eId, ttId, aName, aEmail, aPhone, aToken) => {
      const event = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eId);
      if (!event) throw new Error('EVENT_NOT_FOUND');

      const totalAttendeesRow = localDb.prepare('SELECT COUNT(*) AS total FROM attendees WHERE event_id = ?').get(eId);
      if (totalAttendeesRow.total >= event.capacity) throw new Error('EVENT_CAPACITY_REACHED');

      const ticketType = localDb.prepare('SELECT * FROM ticket_types WHERE id = ? AND event_id = ?').get(ttId, eId);
      if (!ticketType) throw new Error('INVALID_TICKET_TYPE');

      const ticketTypeCountRow = localDb.prepare('SELECT COUNT(*) AS total FROM attendees WHERE ticket_type_id = ?').get(ttId);
      if (ticketTypeCountRow.total >= ticketType.ticket_limit) throw new Error('TICKET_TYPE_SOLD_OUT');

      const insertResult = localDb.prepare(`
        INSERT INTO attendees (event_id, ticket_type_id, name, email, phone, token)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(eId, ttId, aName, aEmail, aPhone || null, aToken);

      return {
        attendeeId: insertResult.lastInsertRowid,
        event,
        ticketType,
      };
    });

    let localResult;
    try {
      localResult = registrationTx(
        Number(eventId),
        Number(ticket_type_id),
        name.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : null,
        token
      );
    } catch (txError) {
      if (!registeredRecord) {
        if (txError.message === 'EVENT_NOT_FOUND') return res.status(404).json({ error: 'Event does not exist.' });
        if (txError.message === 'EVENT_CAPACITY_REACHED') return res.status(400).json({ error: 'Event has reached its maximum capacity.' });
        if (txError.message === 'INVALID_TICKET_TYPE') return res.status(400).json({ error: 'Invalid ticket type selected.' });
        if (txError.message === 'TICKET_TYPE_SOLD_OUT') return res.status(400).json({ error: 'This ticket type is sold out.' });
        throw txError;
      }
    }

    const finalEvent = eventData || localResult?.event;
    const finalTicket = ticketTypeData || localResult?.ticketType;
    const attendeeId = registeredRecord?.id || localResult?.attendeeId;

    // Generate high-resolution QR code
    const qrCodeDataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });

    return res.status(201).json({
      success: true,
      source: registeredRecord ? 'supabase' : 'local',
      message: 'Registration successful! Your pass is ready.',
      attendee: {
        id: attendeeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        token: token,
        ticket_type: finalTicket?.name || 'General',
        event_name: finalEvent?.name || 'Byte Race 2026',
        event_date: finalEvent?.date || '2026-11-01',
        venue: finalEvent?.venue || 'Hackathon Arena',
      },
      token: token,
      qrCode: qrCodeDataUrl,
    });
  } catch (error) {
    console.error('Registration processing error:', error);
    return res.status(500).json({ error: 'Internal server error while processing registration.' });
  }
});

export default router;
