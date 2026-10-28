-- =========================================================================
-- PassGate / ByteRace 2026 Supabase Schema & Seed Script
-- Run this in your Supabase Project -> SQL Editor -> Run
-- =========================================================================

-- 1. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  venue TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Ticket Types Table
CREATE TABLE IF NOT EXISTS public.ticket_types (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ticket_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Attendees Table
CREATE TABLE IF NOT EXISTS public.attendees (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_type_id BIGINT REFERENCES public.ticket_types(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  token TEXT UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Staff Table
CREATE TABLE IF NOT EXISTS public.staff (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_attendees_token ON public.attendees(token);
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON public.attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON public.attendees(checked_in);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON public.ticket_types(event_id);

-- Disable Row Level Security (RLS) for seamless Hackathon demo access with publishable/anon key
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff DISABLE ROW LEVEL SECURITY;

-- If RLS is desired, grant full access policies to anon & authenticated roles:
/*
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all events" ON public.events FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all ticket_types" ON public.ticket_types FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all attendees" ON public.attendees FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all staff" ON public.staff FOR ALL TO public USING (true) WITH CHECK (true);
*/

-- =========================================================================
-- SEED INITIAL DATA (Idempotent: inserts only if not already present)
-- =========================================================================

-- Seed Default Staff (staff / password123)
INSERT INTO public.staff (username, password_hash, role)
VALUES ('staff', '$2a$10$wE8wVjG599M1T3eDk0g5sO9n7yL2/qUa6a7P8v4e3Q1R0S2T4U6V8', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Seed Sample Event: Byte Race 2026 Opening Ceremony
DO $$
DECLARE
  v_event_id BIGINT;
  v_general_id BIGINT;
  v_vip_id BIGINT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.events WHERE name = 'Byte Race 2026 Opening Ceremony') THEN
    INSERT INTO public.events (name, date, venue, capacity)
    VALUES ('Byte Race 2026 Opening Ceremony', '2026-11-01 10:00:00', 'Main Hackathon Arena, Tech Hub', 100)
    RETURNING id INTO v_event_id;

    INSERT INTO public.ticket_types (event_id, name, ticket_limit)
    VALUES (v_event_id, 'General', 80)
    RETURNING id INTO v_general_id;

    INSERT INTO public.ticket_types (event_id, name, ticket_limit)
    VALUES (v_event_id, 'VIP', 20)
    RETURNING id INTO v_vip_id;

    -- Seed Initial Demo Attendees
    INSERT INTO public.attendees (event_id, ticket_type_id, name, email, phone, token, checked_in)
    VALUES 
      (v_event_id, v_general_id, 'Alex Rivers', 'alex.rivers@example.com', '+1-555-0199', 'PASS-BR26-ALEX-001', FALSE),
      (v_event_id, v_vip_id, 'Elena Vance', 'elena.vance@example.com', '+1-555-0244', 'PASS-BR26-ELENA-002', FALSE),
      (v_event_id, v_general_id, 'Marcus Brody', 'marcus.brody@example.com', '+1-555-0811', 'PASS-BR26-MARCUS-003', FALSE),
      (v_event_id, v_vip_id, 'Talia Al Ghul', 'talia.alghul@example.com', '+1-555-0822', 'PASS-BR26-TALIA-004', FALSE)
    ON CONFLICT (token) DO NOTHING;
  END IF;
END $$;
