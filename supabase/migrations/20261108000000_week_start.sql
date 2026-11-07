-- Scores at the start of the current game week, for the weekly limit (PRD FR-4.1).
-- Lets a player who signs in on another phone keep the limit from Monday.
alter table public.players add column week_start jsonb;
