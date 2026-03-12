-- Run this in the Supabase SQL Editor to create tables for class sessions and submissions.
-- Sessions: one per class run (teacher resets by creating a new session).
-- Submissions: each student's choice, grouped by category for class review and workshop strength.

-- Sessions: teacher creates a new one when they want to "reset" and start a fresh class pool
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  label text,
  created_at timestamptz not null default now()
);

-- Submissions: one row per student decision, linked to a session
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  student_name text not null,
  choice_id text not null,
  category text not null,
  score_env numeric,
  score_employment numeric,
  score_trend numeric,
  created_at timestamptz not null default now()
);

-- Index for fast "give me all submissions for this session"
create index if not exists submissions_session_id_idx on public.submissions(session_id);

-- Allow anonymous inserts/selects (game and teacher dashboard use anon key)
-- Restrict so users can only read/write data; for teacher-only views you can add RLS later.
alter table public.sessions enable row level security;
alter table public.submissions enable row level security;

create policy "Allow all for sessions" on public.sessions for all using (true) with check (true);
create policy "Allow all for submissions" on public.submissions for all using (true) with check (true);

-- Optional: add a comment so you remember the categories
comment on column public.submissions.category is 'One of: Work environments, Types of employment, Emerging/declining jobs, Do nothing, Micro niche/specialisation';

-- EST Practice: each student's quiz score per session (contributes to class total / group reward)
create table if not exists public.est_practice (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  student_name text not null,
  score numeric not null,
  total numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists est_practice_session_id_idx on public.est_practice(session_id);
alter table public.est_practice enable row level security;
create policy "Allow all for est_practice" on public.est_practice for all using (true) with check (true);
