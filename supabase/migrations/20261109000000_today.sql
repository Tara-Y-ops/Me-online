-- Today's quests, whether the swap is used, and which are checked in (PRD FR-2).
-- Lets a player who signs in on another phone keep the same quests that day.
alter table public.players add column today jsonb;
