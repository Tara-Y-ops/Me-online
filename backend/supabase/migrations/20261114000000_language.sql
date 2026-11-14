-- The interface language the player is using, 'zh' or 'en'.
-- Saved for the research; the phone's own choice is what the app shows.
alter table public.players
  add column language text not null default 'zh' check (language in ('zh', 'en'));
