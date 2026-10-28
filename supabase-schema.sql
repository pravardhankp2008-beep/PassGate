-- =========================================================================
-- PassGate — Check-in & Event Logistics Engine
-- Database Schema & Realtime Initialization for Supabase (PostgreSQL)
-- Built for Byte Race 2026 · VCET Puttur
-- =========================================================================

-- 1. Enable UUID Extension (Available natively in modern Postgres / Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-initializing
-- (Uncomment during a hard fresh start if needed)
-- DROP TABLE IF EXISTS public.attendees CASCADE;
-- DROP TABLE IF EXISTS public.events CASCADE;

-- 3. Create 'events' Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  venue TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create 'attendees' Table
CREATE TABLE IF NOT EXISTS public.attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  ticket_type TEXT DEFAULT 'General',
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_events_is_active ON public.events(is_active);
CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON public.attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_attendees_checked_in ON public.attendees(checked_in);
CREATE INDEX IF NOT EXISTS idx_attendees_email ON public.attendees(email);

-- 6. Enable Full Replica Identity for Realtime Broadcasts
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.attendees REPLICA IDENTITY FULL;

-- 7. Register Tables with Supabase Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'events'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'attendees'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.attendees;
  END IF;
END $$;

-- 8. Row Level Security (RLS) Configuration
-- Configured for Hackathon Demo: Public Anon read/insert/update allowed
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

-- Drop prior policies if existing to allow clean re-runs
DROP POLICY IF EXISTS "Public all events" ON public.events;
DROP POLICY IF EXISTS "Public select events" ON public.events;
DROP POLICY IF EXISTS "Public insert events" ON public.events;
DROP POLICY IF EXISTS "Public update events" ON public.events;
DROP POLICY IF EXISTS "Public delete events" ON public.events;

CREATE POLICY "Public select events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Public delete events" ON public.events FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public all attendees" ON public.attendees;
DROP POLICY IF EXISTS "Public select attendees" ON public.attendees;
DROP POLICY IF EXISTS "Public insert attendees" ON public.attendees;
DROP POLICY IF EXISTS "Public update attendees" ON public.attendees;
DROP POLICY IF EXISTS "Public delete attendees" ON public.attendees;

CREATE POLICY "Public select attendees" ON public.attendees FOR SELECT USING (true);
CREATE POLICY "Public insert attendees" ON public.attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update attendees" ON public.attendees FOR UPDATE USING (true);
CREATE POLICY "Public delete attendees" ON public.attendees FOR DELETE USING (true);

-- =========================================================================
-- 9. SEED INITIAL DEMO DATA (Idempotent: runs safely without duplicates)
-- =========================================================================
DO $$
DECLARE
  v_event1_id UUID;
  v_event2_id UUID;
  v_event3_id UUID;
BEGIN
  -- Insert Main Flagship Event if not present
  SELECT id INTO v_event1_id FROM public.events WHERE name = 'Byte Race 2026 — Grand Arena' LIMIT 1;
  IF v_event1_id IS NULL THEN
    INSERT INTO public.events (name, venue, event_date, capacity, is_active)
    VALUES (
      'Byte Race 2026 — Grand Arena',
      'Main Auditorium & Tech Complex, VCET Puttur',
      now() + interval '3 days',
      150,
      true
    )
    RETURNING id INTO v_event1_id;

    -- Seed Attendees for Byte Race 2026
    INSERT INTO public.attendees (event_id, full_name, email, ticket_type, checked_in, checked_in_at)
    VALUES
      (v_event1_id, 'Alex Morgan', 'alex.morgan@vcet.edu', 'VIP', true, now() - interval '24 minutes'),
      (v_event1_id, 'Sarah Jenkins', 'sarah.j@techhub.org', 'General', false, NULL),
      (v_event1_id, 'David Chen', 'david.chen@innovate.io', 'General', false, NULL),
      (v_event1_id, 'Priya Sharma', 'priya.sharma@bytefest.net', 'VIP', true, now() - interval '12 minutes'),
      (v_event1_id, 'Marcus Taylor', 'marcus.t@coders.org', 'General', false, NULL),
      (v_event1_id, 'Ananya Rao', 'ananya.rao@vcet.edu', 'General', true, now() - interval '5 minutes'),
      (v_event1_id, 'Rahul Verma', 'rahul.v@cyberlab.dev', 'Student', false, NULL),
      (v_event1_id, 'Kavya Hegde', 'kavya.h@vcet.edu', 'VIP', false, NULL);
  END IF;

  -- Insert Secondary Workshop Event
  SELECT id INTO v_event2_id FROM public.events WHERE name = 'Web3 & AI Agentic Hackathon' LIMIT 1;
  IF v_event2_id IS NULL THEN
    INSERT INTO public.events (name, venue, event_date, capacity, is_active)
    VALUES (
      'Web3 & AI Agentic Hackathon',
      'Innovation Lab 4, Computer Science Block',
      now() + interval '5 days',
      80,
      false
    )
    RETURNING id INTO v_event2_id;

    INSERT INTO public.attendees (event_id, full_name, email, ticket_type, checked_in, checked_in_at)
    VALUES
      (v_event2_id, 'Karthik Bhat', 'karthik.b@vcet.edu', 'General', false, NULL),
      (v_event2_id, 'Emily Zhao', 'emily.zhao@ai-labs.org', 'VIP', true, now() - interval '40 minutes');
  END IF;

  -- Insert Tertiary Keynote Event
  SELECT id INTO v_event3_id FROM public.events WHERE name = 'Algorithmic Trading & High-Frequency Systems' LIMIT 1;
  IF v_event3_id IS NULL THEN
    INSERT INTO public.events (name, venue, event_date, capacity, is_active)
    VALUES (
      'Algorithmic Trading & High-Frequency Systems',
      'Seminar Hall 2, MBA Block',
      now() + interval '7 days',
      120,
      false
    );
  END IF;
END $$;
