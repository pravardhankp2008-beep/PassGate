/**
 * PassGate — Supabase Client & Universal State Controller
 * Built for Byte Race 2026 · VCET Puttur
 * Supports: GitHub Pages, VS Code Live Server, Node.js Express, and Direct File Execution.
 */

(function () {
  const SUPABASE_URL = 'https://xbcnuutbvwdmitkptzcd.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_x-qTffgSQJNdm5q2i9mdoA_7ZoJwO98';

  let supabase = null;

  // Initialize Supabase Client from CDN
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: { params: { eventsPerSecond: 10 } }
      });
    } catch (err) {
      console.warn('[PassGate] Supabase client init warning:', err);
    }
  }

  // Initial Seed Data for Static / GitHub Pages / Live Server Fallback
  const DEFAULT_SEED_EVENTS = [
    {
      id: 'e1-byterace-2026',
      name: 'Byte Race 2026 — Grand Arena',
      venue: 'Main Auditorium & Tech Complex, VCET Puttur',
      event_date: '2026-11-01T09:30:00.000Z',
      capacity: 150,
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'e2-web3-ai',
      name: 'Web3 & AI Agentic Hackathon',
      venue: 'Innovation Lab 4, Computer Science Block',
      event_date: '2026-11-03T10:00:00.000Z',
      capacity: 80,
      is_active: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'e3-algo-trading',
      name: 'Algorithmic Trading & High-Frequency Systems',
      venue: 'Seminar Hall 2, MBA Block',
      event_date: '2026-11-05T14:00:00.000Z',
      capacity: 100,
      is_active: false,
      created_at: new Date().toISOString()
    }
  ];

  const DEFAULT_SEED_ATTENDEES = [
    {
      id: 'PG-BR26-ALEX',
      event_id: 'e1-byterace-2026',
      full_name: 'Alex Morgan',
      email: 'alex.morgan@vcet.edu',
      ticket_type: 'VIP',
      checked_in: true,
      checked_in_at: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-BR26-SARAH',
      event_id: 'e1-byterace-2026',
      full_name: 'Sarah Jenkins',
      email: 'sarah.j@techhub.org',
      ticket_type: 'General',
      checked_in: false,
      checked_in_at: null,
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-BR26-DAVID',
      event_id: 'e1-byterace-2026',
      full_name: 'David Chen',
      email: 'david.chen@innovate.io',
      ticket_type: 'General',
      checked_in: false,
      checked_in_at: null,
      created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-BR26-PRIYA',
      event_id: 'e1-byterace-2026',
      full_name: 'Priya Sharma',
      email: 'priya.sharma@bytefest.net',
      ticket_type: 'VIP',
      checked_in: true,
      checked_in_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-BR26-ANANYA',
      event_id: 'e1-byterace-2026',
      full_name: 'Ananya Rao',
      email: 'ananya.rao@vcet.edu',
      ticket_type: 'General',
      checked_in: true,
      checked_in_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    },
    {
      id: 'PG-BR26-RAHUL',
      event_id: 'e1-byterace-2026',
      full_name: 'Rahul Verma',
      email: 'rahul.v@cyberlab.dev',
      ticket_type: 'Student',
      checked_in: false,
      checked_in_at: null,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ];

  function getLocalStore(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      if (!val) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(val);
    } catch (e) {
      return defaultValue;
    }
  }

  function setLocalStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  window.PassGate = {
    supabase,
    config: {
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY
    },

    /**
     * Micro-UX Toast Notification
     */
    showToast(message, type = 'default') {
      let container = document.getElementById('passgate-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'passgate-toast-container';
        container.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 99999;
          pointer-events: none;
        `;
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.style.cssText = `
        background: ${type === 'danger' ? '#dc2626' : type === 'success' ? '#16a34a' : '#0f172a'};
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 4px 16px rgba(15,23,42,0.18);
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
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

    /**
     * Web Audio API Synthesizer for Scans
     */
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
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.15);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }
      } catch (e) {}
    },

    /**
     * Get All Events with Calculated Real-time Turnout Metrics
     */
    async getEvents() {
      // 1. Try Supabase Remote Database
      if (supabase) {
        try {
          const { data: eventsData, error: evErr } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });

          if (!evErr && eventsData && eventsData.length > 0) {
            const { data: attData } = await supabase
              .from('attendees')
              .select('id, event_id, checked_in');

            return eventsData.map(ev => {
              const evAttendees = (attData || []).filter(a => a.event_id === ev.id);
              const checkedInCount = evAttendees.filter(a => a.checked_in).length;
              return {
                ...ev,
                attendee_count: evAttendees.length,
                checked_in_count: checkedInCount,
                remaining: Math.max(0, ev.capacity - evAttendees.length),
                turnout_pct: ev.capacity > 0 ? Math.round((checkedInCount / ev.capacity) * 100) : 0
              };
            });
          }
        } catch (err) {
          console.warn('[PassGate] Supabase fetch fallback to local store:', err);
        }
      }

      // 2. Try Node Express API (if running server.js locally)
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

      // 3. Fallback to LocalStorage (GitHub Pages & Live Server Zero-Dependency Support)
      const localEvents = getLocalStore('passgate_events', DEFAULT_SEED_EVENTS);
      const localAttendees = getLocalStore('passgate_attendees', DEFAULT_SEED_ATTENDEES);

      return localEvents.map(ev => {
        const evAttendees = localAttendees.filter(a => a.event_id === ev.id);
        const checkedInCount = evAttendees.filter(a => a.checked_in).length;
        return {
          ...ev,
          attendee_count: evAttendees.length,
          checked_in_count: checkedInCount,
          remaining: Math.max(0, ev.capacity - evAttendees.length),
          turnout_pct: ev.capacity > 0 ? Math.round((checkedInCount / ev.capacity) * 100) : 0
        };
      });
    },

    /**
     * Get Current Active Event
     */
    async getActiveEvent() {
      const events = await this.getEvents();
      if (!events || events.length === 0) return null;
      return events.find(e => e.is_active) || events[0];
    },

    /**
     * Register Attendee
     */
    async registerAttendee({ event_id, full_name, email, ticket_type }) {
      const newAttendeeId = 'PG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newRecord = {
        id: newAttendeeId,
        event_id,
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
        } catch (err) {
          console.warn('[PassGate] Supabase register fallback to local:', err);
        }
      }

      // 2. Try Local Express Server (if present)
      try {
        const res = await fetch(`/api/register/${event_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: full_name, email, ticket_type_name: ticket_type })
        });
        if (res.ok) {
          const result = await res.json();
          return {
            success: true,
            attendee: {
              id: result.attendee.token || result.attendee.id,
              event_id,
              full_name: result.attendee.name,
              email: result.attendee.email,
              ticket_type: result.attendee.ticket_type || ticket_type,
              checked_in: false
            }
          };
        }
      } catch (e) {}

      // 3. Fallback Local Storage
      const attendees = getLocalStore('passgate_attendees', DEFAULT_SEED_ATTENDEES);
      attendees.unshift(newRecord);
      setLocalStore('passgate_attendees', attendees);

      return { success: true, attendee: newRecord };
    },

    /**
     * Validate QR Scan at the Gate
     */
    async validateCheckIn(scanPayload) {
      let attendeeId = scanPayload;
      if (typeof scanPayload === 'string') {
        try {
          const parsed = JSON.parse(scanPayload);
          if (parsed.id) attendeeId = parsed.id;
          else if (parsed.token) attendeeId = parsed.token;
        } catch (e) {
          attendeeId = scanPayload.trim();
        }
      }

      if (!attendeeId) {
        return { success: false, reason: 'invalid_format', message: 'Malformed pass data' };
      }

      // 1. Try Supabase
      if (supabase) {
        try {
          const { data: attendee, error } = await supabase
            .from('attendees')
            .select('*, events(name, venue)')
            .eq('id', attendeeId)
            .single();

          if (!error && attendee) {
            if (attendee.checked_in) {
              const timeStr = attendee.checked_in_at
                ? new Date(attendee.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'previously';
              return {
                success: false,
                reason: 'already_used',
                attendee,
                message: `Already checked in at ${timeStr}`
              };
            }

            const nowIso = new Date().toISOString();
            const { error: updErr } = await supabase
              .from('attendees')
              .update({ checked_in: true, checked_in_at: nowIso })
              .eq('id', attendeeId);

            if (!updErr) {
              return {
                success: true,
                attendee: { ...attendee, checked_in: true, checked_in_at: nowIso },
                message: 'Check-in confirmed'
              };
            }
          }
        } catch (err) {
          console.warn('[PassGate] Supabase scan fallback to local:', err);
        }
      }

      // 2. Try Local Express Server (if present)
      try {
        const res = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: attendeeId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            return {
              success: true,
              attendee: {
                id: attendeeId,
                full_name: data.attendee.name,
                ticket_type: data.attendee.ticket_type,
                checked_in: true,
                checked_in_at: data.attendee.checked_in_at
              },
              message: 'Check-in confirmed'
            };
          } else {
            return {
              success: false,
              reason: data.reason || 'failed',
              message: data.message || 'Pass verification failed'
            };
          }
        }
      } catch (e) {}

      // 3. Fallback Local Storage
      const attendees = getLocalStore('passgate_attendees', DEFAULT_SEED_ATTENDEES);
      const match = attendees.find(a => a.id === attendeeId || a.token === attendeeId || a.email.toLowerCase() === attendeeId.toLowerCase());

      if (!match) {
        return { success: false, reason: 'not_found', message: 'Pass not recognized in registry' };
      }

      if (match.checked_in) {
        const timeStr = match.checked_in_at
          ? new Date(match.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'earlier';
        return {
          success: false,
          reason: 'already_used',
          attendee: match,
          message: `Already checked in at ${timeStr}`
        };
      }

      match.checked_in = true;
      match.checked_in_at = new Date().toISOString();
      setLocalStore('passgate_attendees', attendees);

      return {
        success: true,
        attendee: match,
        message: 'Check-in confirmed'
      };
    },

    /**
     * Realtime Turnout Listener
     */
    subscribeToTurnout(eventId, onUpdate) {
      if (!supabase) return null;

      try {
        const channel = supabase
          .channel(`turnout-sync-${eventId || 'global'}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'attendees' }, (payload) => {
            if (typeof onUpdate === 'function') onUpdate(payload);
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
            if (typeof onUpdate === 'function') onUpdate(payload);
          })
          .subscribe();

        return channel;
      } catch (e) {
        return null;
      }
    }
  };
})();
