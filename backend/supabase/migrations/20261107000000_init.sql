-- Me Online, Sprint 1: tables for player data uploaded from the app.
-- Run once in the Supabase dashboard (SQL Editor > New query > Run).
-- See docs/data-model.md for what each column holds.
--
-- Every device signs in anonymously, so each player is a row in auth.users
-- and auth.uid() is their ID. Row-level security lets a player read and
-- write only their own rows. The researcher reads everything from the
-- dashboard, which bypasses these rules.

-- One row per player, updated whenever their data changes.
create table public.players (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  anonymous_id text not null, -- The device ID saved in localStorage
  name text not null,
  consented_at timestamptz not null,
  quiz_answers jsonb not null default '{}', -- BFI-2 item number -> answer 1 to 5
  full_test_at timestamptz, -- When the full 60-item test was finished
  scores jsonb, -- Attribute -> score 0 to 100
  sides jsonb, -- Attribute -> 'low', 'high', or 'neutral'
  self_check jsonb, -- Attribute -> 'yes', 'partly', or 'no'
  quest_style text check (quest_style in ('comfort', 'explore')),
  focus_attributes text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per check-in. Never changed after it is saved.
create table public.check_ins (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  quest_id text not null,
  created_at timestamptz not null, -- Time on the device when the check-in was saved
  kind text not null check (kind in ('stretch', 'home')),
  day date not null, -- Game day, starting at 4:00 a.m. China time
  reaction text not null check (reaction in ('liked', 'okay', 'disliked')),
  note text not null default '',
  tags text[] not null default '{}',
  attribute text not null,
  moved_toward text check (moved_toward in ('low', 'high')), -- null if the score did not move
  amount numeric not null,
  capped boolean not null,
  flipped boolean not null,
  uploaded_at timestamptz not null default now(),
  -- A retried upload of the same check-in is not saved twice.
  primary key (user_id, created_at, quest_id)
);

-- New tables are not exposed to the API automatically in this project, so
-- grant only what the app needs. There is no delete; data is deleted by the
-- researcher on request (NFR-4).
grant select, insert, update on public.players to authenticated;
grant select, insert on public.check_ins to authenticated;

alter table public.players enable row level security;
alter table public.check_ins enable row level security;

create policy "Players read their own row" on public.players
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Players add their own row" on public.players
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Players update their own row" on public.players
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Players read their own check-ins" on public.check_ins
  for select to authenticated using (user_id = (select auth.uid()));
create policy "Players add their own check-ins" on public.check_ins
  for insert to authenticated with check (user_id = (select auth.uid()));
