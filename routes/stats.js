import express from 'express';
import supabase, { localDb } from '../db.js';
import { requireStaff } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/events/:id/stats
 * Aggregates real-time metrics, capacity utilization, ticket-type breakdown,
 * and recent check-ins for the specified event using Supabase with local fallback.
 * Protected by staff authentication. Polled every 2s by the live dashboard.
 */
router.get('/events/:id/stats', requireStaff, async (req, res) => {
  try {
    const eventId = Number(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Valid numeric event ID is required.' });
    }

    // 1. Try querying Supabase
    try {
      const { data: supaEvent, error: evErr } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!evErr && supaEvent) {
        const { data: attendees, error: attErr } = await supabase
          .from('attendees')
          .select('id, ticket_type_id, checked_in, checked_in_at, name, email, token')
          .eq('event_id', eventId);

        const { data: ticketTypes, error: ttErr } = await supabase
          .from('ticket_types')
          .select('*')
          .eq('event_id', eventId)
          .order('id', { ascending: true });

        if (!attErr && !ttErr) {
          const allAttendees = attendees || [];
          const totalRegistered = allAttendees.length;
          const totalCheckedIn = allAttendees.filter((a) => a.checked_in).length;
          const remainingCapacity = Math.max(0, supaEvent.capacity - totalRegistered);
          const turnoutPercentage = totalRegistered > 0
            ? Number(((totalCheckedIn / totalRegistered) * 100).toFixed(1))
            : 0;
          const capacityUtilization = supaEvent.capacity > 0
            ? Number(((totalRegistered / supaEvent.capacity) * 100).toFixed(1))
            : 0;

          const ticketTypesBreakdown = (ticketTypes || []).map((tt) => {
            const forType = allAttendees.filter((a) => a.ticket_type_id === tt.id);
            const reg = forType.length;
            const chk = forType.filter((a) => a.checked_in).length;
            const remaining = tt.ticket_limit - reg;
            return {
              id: tt.id,
              name: tt.name,
              ticket_limit: tt.ticket_limit,
              registered_count: reg,
              checked_in_count: chk,
              remaining_limit: Math.max(0, remaining),
              turnout_percentage: reg > 0 ? Number(((chk / reg) * 100).toFixed(1)) : 0,
              is_sold_out: remaining <= 0,
            };
          });

          // Recent 10 checkins
          const recentCheckins = allAttendees
            .filter((a) => a.checked_in)
            .sort((a, b) => new Date(b.checked_in_at || 0).getTime() - new Date(a.checked_in_at || 0).getTime())
            .slice(0, 10)
            .map((chk) => {
              const matchedType = (ticketTypes || []).find((tt) => tt.id === chk.ticket_type_id);
              return {
                id: chk.id,
                name: chk.name,
                email: chk.email,
                token: chk.token,
                checked_in_at: chk.checked_in_at,
                ticket_type: matchedType?.name || 'General',
              };
            });

          return res.json({
            success: true,
            source: 'supabase',
            event: {
              id: supaEvent.id,
              name: supaEvent.name,
              date: supaEvent.date,
              venue: supaEvent.venue,
              capacity: supaEvent.capacity,
            },
            metrics: {
              capacity: supaEvent.capacity,
              total_registered: totalRegistered,
              total_checked_in: totalCheckedIn,
              remaining_capacity: remainingCapacity,
              turnout_percentage: turnoutPercentage,
              capacity_utilization: capacityUtilization,
            },
            ticket_types: ticketTypesBreakdown,
            recent_checkins: recentCheckins,
            timestamp: new Date().toISOString(),
          });
        }
      }
    } catch (supaErr) {
      // Fall through to local fallback
    }

    // 2. Local fallback
    const event = localDb.prepare(`
      SELECT id, name, date, venue, capacity, created_at 
      FROM events 
      WHERE id = ?
    `).get(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const aggregateRow = localDb.prepare(`
      SELECT 
        COUNT(*) AS total_registered,
        COALESCE(SUM(CASE WHEN checked_in = 1 THEN 1 ELSE 0 END), 0) AS total_checked_in
      FROM attendees
      WHERE event_id = ?
    `).get(eventId);

    const totalRegistered = aggregateRow.total_registered || 0;
    const totalCheckedIn = aggregateRow.total_checked_in || 0;
    const remainingCapacity = Math.max(0, event.capacity - totalRegistered);
    const turnoutPercentage = totalRegistered > 0 
      ? Number(((totalCheckedIn / totalRegistered) * 100).toFixed(1)) 
      : 0;
    const capacityUtilization = event.capacity > 0
      ? Number(((totalRegistered / event.capacity) * 100).toFixed(1))
      : 0;

    const ticketTypesRows = localDb.prepare(`
      SELECT 
        tt.id,
        tt.name,
        tt.ticket_limit,
        COUNT(a.id) AS registered_count,
        COALESCE(SUM(CASE WHEN a.checked_in = 1 THEN 1 ELSE 0 END), 0) AS checked_in_count,
        (tt.ticket_limit - COUNT(a.id)) AS remaining_limit
      FROM ticket_types tt
      LEFT JOIN attendees a ON a.ticket_type_id = tt.id
      WHERE tt.event_id = ?
      GROUP BY tt.id, tt.name, tt.ticket_limit
      ORDER BY tt.id ASC
    `).all(eventId);

    const ticketTypesBreakdown = ticketTypesRows.map((tt) => {
      const reg = tt.registered_count || 0;
      const chk = tt.checked_in_count || 0;
      return {
        id: tt.id,
        name: tt.name,
        ticket_limit: tt.ticket_limit,
        registered_count: reg,
        checked_in_count: chk,
        remaining_limit: Math.max(0, tt.remaining_limit),
        turnout_percentage: reg > 0 ? Number(((chk / reg) * 100).toFixed(1)) : 0,
        is_sold_out: tt.remaining_limit <= 0,
      };
    });

    const recentCheckins = localDb.prepare(`
      SELECT 
        a.id,
        a.name,
        a.email,
        a.token,
        a.checked_in_at,
        tt.name AS ticket_type
      FROM attendees a
      JOIN ticket_types tt ON a.ticket_type_id = tt.id
      WHERE a.event_id = ? AND a.checked_in = 1
      ORDER BY a.checked_in_at DESC, a.id DESC
      LIMIT 10
    `).all(eventId);

    return res.json({
      success: true,
      source: 'local',
      event: {
        id: event.id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        capacity: event.capacity,
      },
      metrics: {
        capacity: event.capacity,
        total_registered: totalRegistered,
        total_checked_in: totalCheckedIn,
        remaining_capacity: remainingCapacity,
        turnout_percentage: turnoutPercentage,
        capacity_utilization: capacityUtilization,
      },
      ticket_types: ticketTypesBreakdown,
      recent_checkins: recentCheckins,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error computing event stats:', error);
    return res.status(500).json({ error: 'Internal server error while compiling statistics.' });
  }
});

export default router;
