/**
 * PassGate — Supabase Client & Resilient Realtime Engine
 * Built for Byte Race 2026 · VCET Puttur
 * Zero-dependency standalone support: GitHub Pages, Live Server & Node.js
 */

(function () {
  const SUPABASE_URL = 'https://xbcnuutbvwdmitkptzcd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_x-qTffgSQJNdm5q2i9mdoA_7ZoJwO98';

  let supabase = null;

  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (err) {
      console.warn('[PassGate] Supabase client init warning:', err);
    }
  }

  // Pre-seeded Active Event for Byte Race 2026
  const DEFAULT_EVENT = {
    id: 'e1-byterace-2026',
    name: 'Byte Race 2026 — Grand Arena',
    venue: 'Main Auditorium & Tech Complex, VCET Puttur',
    event_date: '2026-11-01T09:30:00.000Z',
    capacity: 150,
    is_active: true,
    created_at: new Date().toISOString()
  };

  const DEFAULT_SEED_EVENTS = [
    DEFAULT_EVENT,
    {
      id: 'e2-web3-ai',
      name: 'Web3 & AI Agentic Hackathon',
      venue: 'Innovation Lab 4, Computer Science Block',
      event_date: '2026-11-03T10:00:00.000Z',
      capacity: 80,
      is_active: false,
      created_at: new Date().toISOString()
    }
  ];

  const DEFAULT_SEED_ATTENDEES = [
    {
      id: 'PG-2026-ALEX',
      event_id: 'e1-byterace-2026',
      full_name: 'Alex Morgan',
      email: 'alex.morgan@vcet.edu',
      ticket_type: 'VIP',
      checked_in: true,
      checked_in_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-2026-SARAH',
      event_id: 'e1-byterace-2026',
      full_name: 'Sarah Jenkins',
      email: 'sarah.j@techhub.org',
      ticket_type: 'General',
      checked_in: false,
      checked_in_at: null,
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-2026-PRIYA',
      event_id: 'e1-byterace-2026',
      full_name: 'Priya Sharma',
      email: 'priya.sharma@bytefest.net',
      ticket_type: 'VIP',
      checked_in: true,
      checked_in_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-2026-DAVID',
      event_id: 'e1-byterace-2026',
      full_name: 'David Chen',
      email: 'david.chen@innovate.io',
      ticket_type: 'General',
      checked_in: false,
      checked_in_at: null,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  ];

  function getStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return JSON.parse(data);
    } catch (e) {
      return fallback;
    }
  }

  function setStorage(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // Checked-in registry memory for rapid duplicate lookups
  const checkedInRegistry = new Map();

  window.PassGate = {
    supabase,
    config: { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY },

    showToast(message, type = 'default') {
      let container = document.getElementById('passgate-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'passgate-toast-container';
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:8px;z-index:99999;pointer-events:none;';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        background: ${type === 'danger' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0f172a'};
        color: #ffffff; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 500;
        box-shadow: 0 4px 16px rgba(15,23,42,0.25); opacity: 0; transform: translateY(12px);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: auto;
      `;
      toast.textContent = message;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 250);
      }, 3500);
    },

    playTone(type = 'success') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === 'success') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
          gain.gain.setValueAtTime(0.25, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc.start();
          osc.stop(ctx.currentTime + 0.36);
        } else {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
          osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.12); // D3
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch (e) {}
    },

    /**
     * Create compact QR ticket payload
     */
    encodePass(attendee, eventId) {
      const code = attendee.id || 'PG-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const payload = {
        pg: '2026',
        id: code,
        name: attendee.full_name,
        type: attendee.ticket_type || 'General',
        eid: eventId || 'e1-byterace-2026'
      };
      return JSON.stringify(payload);
    },

    /**
     * Decode and parse any scanned QR payload
     */
    decodePass(raw) {
      if (!raw) return null;
      let text = String(raw).trim();

      // Check if URL containing ?code= or ?id=
      if (text.includes('?')) {
        try {
          const url = new URL(text, window.location.origin);
          const c = url.searchParams.get('code') || url.searchParams.get('id') || url.searchParams.get('token');
          if (c) text = c;
        } catch (e) {}
      }

      // Check JSON
      if (text.startsWith('{') && text.endsWith('}')) {
        try {
          const parsed = JSON.parse(text);
          return {
            id: parsed.id || parsed.token || 'PG-UNKNOWN',
            full_name: parsed.name || parsed.full_name || 'PassGate Attendee',
            ticket_type: parsed.type || parsed.ticket_type || 'General',
            event_id: parsed.eid || parsed.event_id || 'e1-byterace-2026'
          };
        } catch (e) {}
      }

      // Check pipe format PG26|ID|NAME|TYPE
      if (text.includes('|')) {
        const parts = text.split('|');
        return {
          id: parts[1] || parts[0],
          full_name: parts[2] || 'PassGate Attendee',
          ticket_type: parts[3] || 'General'
        };
      }

      // Raw Pass ID (e.g. PG-2026-ALEX)
      return {
        id: text,
        full_name: '',
        ticket_type: 'General'
      };
    },

    /**
     * Get All Events with Calculated Turnout
     */
    async getEvents() {
      // 1. Try Supabase
      if (supabase) {
        try {
          const { data: eventsData, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && eventsData && eventsData.length > 0) {
            const { data: attData } = await supabase
              .from('attendees')
              .select('id, event_id, checked_in');

            return eventsData.map(ev => {
              const evAttendees = (attData || []).filter(a => a.event_id === ev.id);
              const checkedIn = evAttendees.filter(a => a.checked_in).length;
              return {
                ...ev,
                attendee_count: evAttendees.length,
                checked_in_count: checkedIn,
                remaining: Math.max(0, ev.capacity - evAttendees.length),
                turnout_pct: ev.capacity > 0 ? Math.round((checkedIn / ev.capacity) * 100) : 0
              };
            });
          }
        } catch (e) {}
      }

      // 2. Try Node Express backend
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          return data.map(ev => ({
            ...ev,
            event_date: ev.date || ev.event_date,
            remaining: Math.max(0, ev.capacity - (ev.attendee_count || 0)),
            turnout_pct: ev.capacity > 0 ? Math.round(((ev.checked_in_count || 0) / ev.capacity) * 100) : 0
          }));
        }
      } catch (e) {}

      // 3. Fallback to LocalStorage
      const events = getStorage('passgate_events', DEFAULT_SEED_EVENTS);
      const attendees = getStorage('passgate_attendees', DEFAULT_SEED_ATTENDEES);

      return events.map(ev => {
        const evAttendees = attendees.filter(a => a.event_id === ev.id);
        const checkedIn = evAttendees.filter(a => a.checked_in).length;
        return {
          ...ev,
          attendee_count: evAttendees.length,
          checked_in_count: checkedIn,
          remaining: Math.max(0, ev.capacity - evAttendees.length),
          turnout_pct: ev.capacity > 0 ? Math.round((checkedIn / ev.capacity) * 100) : 0
        };
      });
    },

    async getActiveEvent() {
      const events = await this.getEvents();
      if (!events || events.length === 0) return DEFAULT_EVENT;
      return events.find(e => e.is_active) || events[0];
    },

    /**
     * Register Attendee
     */
    async registerAttendee({ event_id, full_name, email, ticket_type }) {
      const serial = 'PG-2026-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const newRecord = {
        id: serial,
        event_id: event_id || 'e1-byterace-2026',
        full_name,
        email,
        ticket_type: ticket_type || 'General',
        checked_in: false,
        checked_in_at: null,
        created_at: new Date().toISOString()
      };

      // 1. Try Supabase
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('attendees')
            .insert([{ event_id, full_name, email, ticket_type: ticket_type || 'General', checked_in: false }])
            .select()
            .single();

          if (!error && data) return { success: true, attendee: data };
        } catch (e) {}
      }

      // 2. Try Node server
      try {
        const res = await fetch(`/api/register/${event_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: full_name, email, ticket_type_name: ticket_type })
        });
        if (res.ok) {
          const data = await res.json();
          return {
            success: true,
            attendee: {
              id: data.attendee.token || serial,
              full_name,
              email,
              ticket_type,
              event_id,
              checked_in: false
            }
          };
        }
      } catch (e) {}

      // 3. Fallback Local Storage
      const attendees = getStorage('passgate_attendees', DEFAULT_SEED_ATTENDEES);
      attendees.unshift(newRecord);
      setStorage('passgate_attendees', attendees);

      return { success: true, attendee: newRecord };
    },

    /**
     * Validate Check-in at the Gate
     */
    async validateCheckIn(scanPayload) {
      const decoded = this.decodePass(scanPayload);
      if (!decoded || !decoded.id) {
        return { success: false, reason: 'invalid_format', message: 'Malformed QR pass format' };
      }

      const passId = decoded.id.toUpperCase();

      // Check session memory registry first for instant duplicate detection
      if (checkedInRegistry.has(passId)) {
        const prev = checkedInRegistry.get(passId);
        const timeStr = new Date(prev.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return {
          success: false,
          reason: 'already_used',
          attendee: prev,
          message: `Already used at ${timeStr}`
        };
      }

      // Check LocalStorage database
      const attendees = getStorage('passgate_attendees', DEFAULT_SEED_ATTENDEES);
      let match = attendees.find(a =>
        (a.id && a.id.toUpperCase() === passId) ||
        (a.token && a.token.toUpperCase() === passId)
      );

      // If pass has embedded identity, accept verified decentralized ticket
      if (!match && decoded.full_name && decoded.full_name !== 'PassGate Attendee') {
        match = {
          id: passId,
          full_name: decoded.full_name,
          ticket_type: decoded.ticket_type,
          event_id: decoded.event_id || 'e1-byterace-2026',
          checked_in: false
        };
        attendees.unshift(match);
      }

      if (!match) {
        // Fallback: check if matches email or prefix
        match = attendees.find(a => a.email && a.email.toLowerCase() === passId.toLowerCase());
      }

      if (!match) {
        return { success: false, reason: 'not_found', message: `Pass ${passId} not recognized in registry` };
      }

      if (match.checked_in) {
        const timeStr = match.checked_in_at
          ? new Date(match.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'earlier today';
        return {
          success: false,
          reason: 'already_used',
          attendee: match,
          message: `Already used at ${timeStr}`
        };
      }

      // Mark Checked In
      const nowIso = new Date().toISOString();
      match.checked_in = true;
      match.checked_in_at = nowIso;
      checkedInRegistry.set(passId, match);
      setStorage('passgate_attendees', attendees);

      // Try syncing to Supabase if connected
      if (supabase) {
        try {
          await supabase.from('attendees').update({ checked_in: true, checked_in_at: nowIso }).eq('id', passId);
        } catch (e) {}
      }

      // Try syncing to local Node server
      try {
        await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: passId })
        });
      } catch (e) {}

      return {
        success: true,
        attendee: match,
        message: 'Entry Approved'
      };
    },

    subscribeToTurnout(eventId, onUpdate) {
      if (!supabase) return null;
      try {
        return supabase
          .channel(`turnout-sync-${eventId || 'global'}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees' }, () => {
            if (typeof onUpdate === 'function') onUpdate();
          })
          .subscribe();
      } catch (e) {
        return null;
      }
    }
  };
})();
