import express from 'express';
import supabase, { localDb } from '../db.js';
import { requireStaff } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/events
 * List all events with live attendance counters & venue details
 */
router.get('/events', async (req, res) => {
  try {
    // 1. Try Supabase
    try {
      const { data: supaEvents, error: evErr } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: false });

      if (!evErr && supaEvents && supaEvents.length > 0) {
        const { data: attendees } = await supabase
          .from('attendees')
          .select('id, event_id, checked_in');

        const { data: ticketTypes } = await supabase
          .from('ticket_types')
          .select('*');

        const enriched = supaEvents.map((ev) => {
          const evAttendees = (attendees || []).filter((a) => a.event_id === ev.id);
          const registered = evAttendees.length;
          const checkedIn = evAttendees.filter((a) => a.checked_in).length;
          const remaining = Math.max(0, ev.capacity - registered);
          const venueSpotsLeft = Math.max(0, ev.capacity - checkedIn);
          const evTickets = (ticketTypes || []).filter((t) => t.event_id === ev.id);

          return {
            ...ev,
            total_registered: registered,
            total_checked_in: checkedIn,
            remaining_capacity: remaining,
            venue_headroom: venueSpotsLeft,
            turnout_percentage: registered > 0 ? Number(((checkedIn / registered) * 100).toFixed(1)) : 0,
            capacity_utilization: ev.capacity > 0 ? Number(((registered / ev.capacity) * 100).toFixed(1)) : 0,
            ticket_types: evTickets,
          };
        });

        return res.json({
          source: 'supabase',
          events: enriched,
        });
      }
    } catch (supaErr) {
      // Fall through to local fallback
    }

    // 2. Local fallback
    const localEvents = localDb.prepare('SELECT * FROM events ORDER BY id DESC').all();
    const enriched = localEvents.map((ev) => {
      const counts = localDb.prepare(`
        SELECT 
          COUNT(*) AS total_registered,
          COALESCE(SUM(CASE WHEN checked_in = 1 THEN 1 ELSE 0 END), 0) AS total_checked_in
        FROM attendees WHERE event_id = ?
      `).get(ev.id);

      const registered = counts.total_registered || 0;
      const checkedIn = counts.total_checked_in || 0;
      const remaining = Math.max(0, ev.capacity - registered);
      const venueSpotsLeft = Math.max(0, ev.capacity - checkedIn);

      const tickets = localDb.prepare('SELECT * FROM ticket_types WHERE event_id = ?').all(ev.id);

      return {
        ...ev,
        total_registered: registered,
        total_checked_in: checkedIn,
        remaining_capacity: remaining,
        venue_headroom: venueSpotsLeft,
        turnout_percentage: registered > 0 ? Number(((checkedIn / registered) * 100).toFixed(1)) : 0,
        capacity_utilization: ev.capacity > 0 ? Number(((registered / ev.capacity) * 100).toFixed(1)) : 0,
        ticket_types: tickets,
      };
    });

    res.json({
      source: 'local',
      events: enriched,
    });
  } catch (error) {
    console.error('Error listing events:', error);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
});

/**
 * POST /api/events
 * Create a new event with venue, date, capacity, and default ticket allocations
 * Protected by staff authentication
 */
router.post('/events', requireStaff, async (req, res) => {
  try {
    const { name, date, venue, capacity, general_limit, vip_limit } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Event name is required.' });
    }
    if (!venue || !venue.trim()) {
      return res.status(400).json({ error: 'Venue name/location is required.' });
    }

    const cleanCapacity = Math.max(1, parseInt(capacity, 10) || 100);
    const cleanDate = date ? date.trim() : new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 19).replace('T', ' ');
    const genLimit = Math.max(1, parseInt(general_limit, 10) || Math.floor(cleanCapacity * 0.8));
    const vipLimit = Math.max(0, parseInt(vip_limit, 10) || Math.floor(cleanCapacity * 0.2));

    let createdEvent = null;

    // 1. Try Supabase Insertion
    try {
      const { data: supaEvent, error: evErr } = await supabase
        .from('events')
        .insert({
          name: name.trim(),
          date: cleanDate,
          venue: venue.trim(),
          capacity: cleanCapacity,
        })
        .select()
        .single();

      if (!evErr && supaEvent) {
        createdEvent = supaEvent;

        // Insert ticket tiers into Supabase
        await supabase.from('ticket_types').insert([
          { event_id: supaEvent.id, name: 'General', ticket_limit: genLimit },
          { event_id: supaEvent.id, name: 'VIP', ticket_limit: vipLimit },
        ]);
      }
    } catch (supaErr) {
      console.warn('Supabase event creation notice:', supaErr.message);
    }

    // 2. Sync / Insert in Local SQLite
    const localTx = localDb.transaction(() => {
      const insRes = localDb.prepare(`
        INSERT INTO events (name, date, venue, capacity)
        VALUES (?, ?, ?, ?)
      `).run(name.trim(), cleanDate, venue.trim(), cleanCapacity);

      const eventId = createdEvent?.id || insRes.lastInsertRowid;

      localDb.prepare('INSERT INTO ticket_types (event_id, name, ticket_limit) VALUES (?, ?, ?)').run(eventId, 'General', genLimit);
      localDb.prepare('INSERT INTO ticket_types (event_id, name, ticket_limit) VALUES (?, ?, ?)').run(eventId, 'VIP', vipLimit);

      if (!createdEvent) {
        createdEvent = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
      }
    });

    localTx();

    return res.status(201).json({
      success: true,
      message: `Event "${name.trim()}" successfully created!`,
      event: createdEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

/**
 * PATCH /api/events/:id/venue
 * Make changes in the venue name/hall, location, or venue capacity
 * Protected by staff authentication
 */
router.patch('/events/:id/venue', requireStaff, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { venue, capacity, name, date } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Valid numeric event ID is required.' });
    }

    let updatedEvent = null;

    // Build update payload
    const updates = {};
    if (venue !== undefined && venue.trim()) updates.venue = venue.trim();
    if (capacity !== undefined) updates.capacity = Math.max(1, parseInt(capacity, 10));
    if (name !== undefined && name.trim()) updates.name = name.trim();
    if (date !== undefined && date.trim()) updates.date = date.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'At least one field (venue, capacity, name, date) must be provided.' });
    }

    // 1. Try Supabase Update
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (!error && data) {
        updatedEvent = data;
      }
    } catch (supaErr) {
      console.warn('Supabase venue update notice:', supaErr.message);
    }

    // 2. Update Local SQLite
    const current = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    if (!current && !updatedEvent) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const finalVenue = updates.venue || current?.venue;
    const finalCapacity = updates.capacity || current?.capacity;
    const finalName = updates.name || current?.name;
    const finalDate = updates.date || current?.date;

    localDb.prepare(`
      UPDATE events 
      SET venue = ?, capacity = ?, name = ?, date = ?
      WHERE id = ?
    `).run(finalVenue, finalCapacity, finalName, finalDate, eventId);

    if (!updatedEvent) {
      updatedEvent = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eventId);
    }

    return res.json({
      success: true,
      message: `Venue and event details successfully updated for "${updatedEvent.name}".`,
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating venue details:', error);
    res.status(500).json({ error: 'Failed to update venue details.' });
  }
});

/**
 * POST /api/events/:id/capacity-counter
 * Admin Quick Capacity Counter: dynamically adjust venue capacity up or down
 * Protected by staff authentication
 */
router.post('/events/:id/capacity-counter', requireStaff, async (req, res) => {
  try {
    const eventId = Number(req.params.id);
    const { delta, new_capacity } = req.body;

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Valid numeric event ID is required.' });
    }

    // Get current event capacity
    let currentCapacity = 100;
    try {
      const { data } = await supabase.from('events').select('capacity').eq('id', eventId).single();
      if (data) currentCapacity = data.capacity;
    } catch {}

    const localEv = localDb.prepare('SELECT capacity FROM events WHERE id = ?').get(eventId);
    if (localEv) currentCapacity = localEv.capacity;

    let targetCapacity = currentCapacity;
    if (new_capacity !== undefined) {
      targetCapacity = Math.max(1, parseInt(new_capacity, 10));
    } else if (delta !== undefined) {
      targetCapacity = Math.max(1, currentCapacity + parseInt(delta, 10));
    }

    // Update in Supabase
    try {
      await supabase.from('events').update({ capacity: targetCapacity }).eq('id', eventId);
    } catch {}

    // Update in local DB
    localDb.prepare('UPDATE events SET capacity = ? WHERE id = ?').run(targetCapacity, eventId);

    const updated = localDb.prepare('SELECT * FROM events WHERE id = ?').get(eventId);

    return res.json({
      success: true,
      message: `Venue capacity adjusted to ${targetCapacity} seats.`,
      capacity: targetCapacity,
      previous: currentCapacity,
      event: updated,
    });
  } catch (error) {
    console.error('Error adjusting capacity counter:', error);
    res.status(500).json({ error: 'Failed to adjust capacity counter.' });
  }
});

export default router;
